import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/app_models.dart';
import '../../providers/auth_providers.dart';
import '../../providers/user_providers.dart';
import '../../services/firebase/user_repository.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  int _step = 0;
  int _previousStep = 0;
  String _error = '';
  bool _submitting = false;
  bool _shareMode = false;
  bool _stepHydrated = false;

  final _displayNameController = TextEditingController();
  final _partnerUsernameController = TextEditingController();
  final _petNameController = TextEditingController();

  PetType? _selectedPetType;

  @override
  void dispose() {
    _displayNameController.dispose();
    _partnerUsernameController.dispose();
    _petNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(profileProvider).value;
    final relationship = ref.watch(relationshipProvider).value;
    if (profile == null || relationship == null) {
      return const CozyScaffold(title: 'Setting up your nest…', child: Center(child: CircularProgressIndicator()));
    }

    if (!_stepHydrated) {
      _hydrateFromBackend(profile, relationship);
    }

    if (profile.onboardingCompleted || relationship.onboardingStep == OnboardingStep.completed) {
      WidgetsBinding.instance.addPostFrameCallback((_) => context.go('/'));
    }

    final pages = <Widget>[
      _buildWelcomeStep(),
      _buildRegisterStep(profile, relationship),
      _buildPartnerStep(profile, relationship),
      _buildPetStep(relationship),
    ];

    return CozyScaffold(
      title: 'Shared Pet Setup ✨',
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                SizedBox(
                  width: 36,
                  child: _step > 0
                      ? IconButton(
                          tooltip: 'Back',
                          onPressed: _submitting ? null : _goBack,
                          icon: const Icon(Icons.chevron_left),
                        )
                      : null,
                ),
                const SizedBox(width: 8),
                Expanded(child: LinearProgressIndicator(value: (_step + 1) / 4)),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 260),
                switchInCurve: Curves.easeOutCubic,
                switchOutCurve: Curves.easeInCubic,
                transitionBuilder: (child, animation) {
                  final isForward = _step >= _previousStep;
                  final offsetTween = Tween<Offset>(
                    begin: Offset(0, isForward ? 0.08 : -0.08),
                    end: Offset.zero,
                  );
                  return FadeTransition(
                    opacity: animation,
                    child: SlideTransition(position: offsetTween.animate(animation), child: child),
                  );
                },
                child: KeyedSubtree(key: ValueKey(_step), child: pages[_step]),
              ),
            ),
            if (_error.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeStep() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Welcome to Lovegotchi', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
          const SizedBox(height: 10),
          const Text('Raise a shared digital lifeform with your partner — together.'),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: AppPrimaryButton(onPressed: _submitting ? null : () => _goToStep(1), label: 'Begin Your Journey'),
          )
        ],
      );

  Widget _buildRegisterStep(UserProfile profile, Relationship relationship) {
    final generatedUsername = _generateUsername(_displayNameController.text.trim());
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Who are you?', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
        const SizedBox(height: 8),
        const Text('Let us know what to call you. We will create a unique username for you to share with your partner.'),
        const SizedBox(height: 10),
        AppTextField(controller: _displayNameController, decoration: const InputDecoration(labelText: 'Your name', hintText: 'e.g. Jamie')),
        const SizedBox(height: 12),
        if (_displayNameController.text.trim().length >= 2) ...[
          Text('Your username: @$generatedUsername', style: const TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          const Text('Share this with your partner so they can find you'),
        ],
        const Spacer(),
        SizedBox(
          width: double.infinity,
          child: AppPrimaryButton(
            onPressed: _submitting ? null : () => _saveProfile(profile, relationship, generatedUsername),
            label: 'Continue',
          ),
        )
      ],
    );
  }

  Widget _buildPartnerStep(UserProfile profile, Relationship relationship) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Find your partner', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          const Text('Connect with your special someone to raise your Lovegotchi together.'),
          const SizedBox(height: 12),
          SegmentedButton<bool>(
            segments: const [ButtonSegment(value: false, label: Text('Find Partner')), ButtonSegment(value: true, label: Text('Share Code'))],
            selected: {_shareMode},
            onSelectionChanged: (value) => setState(() => _shareMode = value.first),
          ),
          const SizedBox(height: 12),
          if (!_shareMode) ...[
            AppTextField(controller: _partnerUsernameController, decoration: const InputDecoration(labelText: 'Partner username', hintText: '@partner_username')),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: AppPrimaryButton(
                onPressed: _submitting ? null : () => _savePartner(profile, relationship),
                label: 'Send Invitation',
              ),
            )
          ] else ...[
            const Text('Tell your partner to search for you using this username:'),
            const SizedBox(height: 8),
            Text(
              '@${profile.username.isEmpty ? _generateUsername(_displayNameController.text) : profile.username}',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            const Text('Waiting for your partner to connect...'),
          ],
          const Spacer(),
          Align(
            alignment: Alignment.center,
            child: TextButton(onPressed: _submitting ? null : _skipPartnerForNow, child: const Text('I will invite them later')),
          )
        ],
      );

  Widget _buildPetStep(Relationship relationship) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Meet your companion', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          const Text('Choose a pet type and name it together. This little one will grow with your relationship.'),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: PetType.values
                .map((type) => ChoiceChip(label: Text(_label(type)), selected: _selectedPetType == type, onSelected: (_) => setState(() => _selectedPetType = type)))
                .toList(),
          ),
          const SizedBox(height: 12),
          AppTextField(controller: _petNameController, decoration: const InputDecoration(labelText: 'Pet name', hintText: 'e.g. Mochi, Luna, Pixel')),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: AppPrimaryButton(onPressed: _submitting ? null : () => _completeOnboarding(relationship), label: 'Start Our Journey'),
          )
        ],
      );

  Future<void> _saveProfile(UserProfile profile, Relationship relationship, String generatedUsername) async {
    final displayName = _displayNameController.text.trim();
    if (displayName.length < 2) return _setError('Please enter a name with at least 2 characters');
    await _runSubmit(() async {
      await ref.read(userRepositoryProvider).updateProfileBasics(uid: profile.uid, displayName: displayName, username: generatedUsername);
      await ref.read(userRepositoryProvider).setOnboardingStep(relationshipId: relationship.id, step: OnboardingStep.nameVote);
      _goToStep(2);
    });
  }

  Future<void> _savePartner(UserProfile profile, Relationship relationship) async {
    final partner = _partnerUsernameController.text.trim().replaceAll('@', '');
    if (partner.length < 3) return _setError('Please enter a valid username');
    if (partner == profile.username) return _setError('That is your own username!');
    await _runSubmit(() async {
      await ref.read(userRepositoryProvider).invitePartnerByUsername(currentUid: profile.uid, relationshipId: relationship.id, partnerUsername: partner);
      _goToStep(3);
    });
  }

  Future<void> _skipPartnerForNow() async {
    _setError('');
    _goToStep(3);
  }

  Future<void> _completeOnboarding(Relationship relationship) async {
    final petName = _petNameController.text.trim();
    if (_selectedPetType == null) return _setError('Please choose a pet type');
    if (petName.length < 2) return _setError('Please give your pet a name (2+ characters)');
    await _runSubmit(() async {
      await ref.read(userRepositoryProvider).completeOnboarding(relationship: relationship, petType: _selectedPetType!, petName: petName);
      if (mounted) context.go('/');
    });
  }

  Future<void> _runSubmit(Future<void> Function() fn) async {
    setState(() {
      _submitting = true;
      _error = '';
    });
    try {
      await fn();
    } catch (e) {
      _setError(_friendlyError(e.toString()));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _hydrateFromBackend(UserProfile profile, Relationship relationship) {
    _stepHydrated = true;
    if (_displayNameController.text.isEmpty && profile.displayName.isNotEmpty) {
      _displayNameController.text = profile.displayName;
    }
    final backendStep = _stepFromBackend(profile, relationship);
    _step = backendStep;
    _previousStep = backendStep;
  }

  int _stepFromBackend(UserProfile profile, Relationship relationship) {
    if (profile.onboardingCompleted || relationship.onboardingStep == OnboardingStep.completed) return 3;
    if (relationship.onboardingStep == OnboardingStep.petType) return 1;
    if (relationship.onboardingStep == OnboardingStep.nameVote) return 2;
    return 0;
  }

  void _goBack() => _goToStep((_step - 1).clamp(0, 3));

  void _goToStep(int value) {
    setState(() {
      _previousStep = _step;
      _step = value;
      _error = '';
    });
  }

  void _setError(String value) => setState(() => _error = value);

  String _friendlyError(String error) {
    final lower = error.toLowerCase();
    if (lower.contains('could not find that username')) return 'Could not find that username yet.';
    if (lower.contains('permission-denied')) return 'You do not have permission to perform this action right now.';
    return error.replaceFirst('Exception: ', '');
  }

  String _generateUsername(String displayName) {
    final normalized = displayName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
    if (normalized.length < 2) return '';
    final seed = DateTime.now().millisecondsSinceEpoch % 9000 + 1000;
    return '${normalized.substring(0, normalized.length.clamp(2, 12))}$seed';
  }

  String _label(PetType type) => switch (type) {
        PetType.blob => 'Blob 👾',
        PetType.fox => 'Fox 🦊',
        PetType.bunny => 'Bunny 🐰',
        PetType.alien => 'Alien 👽',
        PetType.cloudSpirit => 'Cloud ☁️',
      };
}
