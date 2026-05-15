import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../models/app_models.dart';
import '../../providers/user_providers.dart';
import '../../services/firebase/user_repository.dart';
import '../../shared/widgets/cozy_scaffold.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _nameController = TextEditingController();

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

    final repo = ref.read(userRepositoryProvider);
    String? partnerSuggestion;
    for (final entry in relationship.nameSuggestions.entries) {
      if (entry.key != profile.uid) {
        partnerSuggestion = entry.value;
        break;
      }
    }

    return CozyScaffold(
      title: 'Shared Pet Setup ✨',
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (relationship.onboardingStep == OnboardingStep.petType) ...[
            const Text('Choose your shared pet type'),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: PetType.values
                  .map((type) => ChoiceChip(
                        label: Text(_label(type)),
                        selected: relationship.petType == type,
                        onSelected: (_) => repo.setPetType(relationship.id, type),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 24),
          ],
          TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Suggest a cozy name')),
          const SizedBox(height: 8),
          FilledButton(
            onPressed: () => repo.suggestName(relationshipId: relationship.id, uid: profile.uid, name: _nameController.text),
            child: const Text('Suggest name'),
          ),
          const SizedBox(height: 20),
          Text('Your suggestion: ${relationship.nameSuggestions[profile.uid] ?? '—'}'),
          Text('Partner suggestion: ${partnerSuggestion ?? 'Waiting…'}'),
          if (partnerSuggestion != null) ...[
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: () => repo.approveName(relationship: relationship, uid: profile.uid, name: partnerSuggestion),
              child: const Text('Approve partner name'),
            ),
          ]
        ],
      ),
    );
  }

  String _label(PetType type) => switch (type) {
        PetType.blob => 'Blob 🫧',
        PetType.fox => 'Fox 🦊',
        PetType.bunny => 'Bunny 🐰',
        PetType.alien => 'Alien 👽',
        PetType.cloudSpirit => 'Cloud Spirit ☁️',
      };
}
