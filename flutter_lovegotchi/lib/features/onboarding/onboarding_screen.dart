import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/app_models.dart';
import '../../providers/auth_providers.dart';
import '../../providers/user_providers.dart';
import '../../services/firebase/user_repository.dart';
import '../../shared/widgets/cozy_scaffold.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  int _step = 0;
  String _error = '';
  bool _submitting = false;
  bool _shareMode = false;

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
            LinearProgressIndicator(value: (_step + 1) / 4),
            const SizedBox(height: 16),
            Expanded(child: AnimatedSwitcher(duration: const Duration(milliseconds: 250), child: KeyedSubtree(key: ValueKey(_step), child: pages[_step]))),
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
          const Text('Raise a shared digital lifeform with your partner together.'),
          const Spacer(),
          SizedBox(
            width: double.infinity,
            child: FilledButton(onPressed: _submitting ? null : () => setState(() => _step = 1), child: const Text('Begin Your Journey')),
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
        TextField(controller: _displayNameController, decoration: const InputDecoration(labelText: 'Your name')),
        const SizedBox(height: 12),
        if (_displayNameController.text.trim().length >= 2)
          Text('Username preview: @$generatedUsername', style: const TextStyle(fontWeight: FontWeight.w600)),
        const Spacer(),
        Row(
          children: [
            OutlinedButton(onPressed: _submitting ? null : () => setState(() => _step = 0), child: const Text('Back')),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(
                onPressed: _submitting ? null : () => _saveProfile(profile, relationship, generatedUsername),
                child: const Text('Continue'),
              ),
            )
          ],
        )
      ],
    );
  }

  Widget _buildPartnerStep(UserProfile profile, Relationship relationship) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Find your partner', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          SegmentedButton<bool>(
            segments: const [ButtonSegment(value: false, label: Text('Find Partner')), ButtonSegment(value: true, label: Text('Share Username'))],
            selected: {_shareMode},
            onSelectionChanged: (value) => setState(() => _shareMode = value.first),
          ),
          const SizedBox(height: 12),
          if (!_shareMode) ...[
            TextField(controller: _partnerUsernameController, decoration: const InputDecoration(labelText: 'Partner username (without @)')),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _submitting ? null : () => _savePartner(profile, relationship),
              child: const Text('Send Invitation'),
            )
          ] else
            Text('Share this username: @${profile.username.isEmpty ? _generateUsername(_displayNameController.text) : profile.username}'),
          const Spacer(),
          Row(children: [
            OutlinedButton(onPressed: _submitting ? null : () => setState(() => _step = 1), child: const Text('Back')),
            const Spacer(),
            TextButton(onPressed: _submitting ? null : () => setState(() => _step = 3), child: const Text('I will invite later')),
          ])
        ],
      );

  Widget _buildPetStep(Relationship relationship) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Meet your companion', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: PetType.values
                .map((type) => ChoiceChip(label: Text(_label(type)), selected: _selectedPetType == type, onSelected: (_) => setState(() => _selectedPetType = type)))
                .toList(),
          ),
          const SizedBox(height: 12),
          TextField(controller: _petNameController, decoration: const InputDecoration(labelText: 'Pet name')),
          const Spacer(),
          Row(children: [
            OutlinedButton(onPressed: _submitting ? null : () => setState(() => _step = 2), child: const Text('Back')),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton(onPressed: _submitting ? null : () => _completeOnboarding(relationship), child: const Text('Start Our Journey')),
            )
          ])
        ],
      );

  Future<void> _saveProfile(UserProfile profile, Relationship relationship, String generatedUsername) async {
    final displayName = _displayNameController.text.trim();
    if (displayName.length < 2) return _setError('Please enter a name with at least 2 characters');
    await _runSubmit(() async {
      await ref.read(userRepositoryProvider).updateProfileBasics(uid: profile.uid, displayName: displayName, username: generatedUsername);
      await ref.read(userRepositoryProvider).setOnboardingStep(relationshipId: relationship.id, step: OnboardingStep.nameVote);
      setState(() => _step = 2);
    });
  }

  Future<void> _savePartner(UserProfile profile, Relationship relationship) async {
    final partner = _partnerUsernameController.text.trim().replaceFirst('@', '');
    if (partner.length < 3) return _setError('Please enter a valid username');
    if (partner == profile.username) return _setError('That is your own username');
    await _runSubmit(() async {
      await ref.read(userRepositoryProvider).invitePartnerByUsername(currentUid: profile.uid, relationshipId: relationship.id, partnerUsername: partner);
      setState(() => _step = 3);
    });
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
      _setError(e.toString());
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _setError(String value) => setState(() => _error = value);

  String _generateUsername(String displayName) {
    final normalized = displayName.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '');
    if (normalized.length < 2) return '';
    final seed = DateTime.now().millisecondsSinceEpoch % 9000 + 1000;
    return '${normalized.substring(0, normalized.length.clamp(2, 12))}$seed';
  }

  String _label(PetType type) => switch (type) {
        PetType.blob => 'Blob 🫧',
        PetType.fox => 'Fox 🦊',
        PetType.bunny => 'Bunny 🐰',
        PetType.alien => 'Alien 👽',
        PetType.cloudSpirit => 'Cloud Spirit ☁️',
      };
}
