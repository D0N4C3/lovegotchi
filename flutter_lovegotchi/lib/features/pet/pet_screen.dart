import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/pet_models.dart';
import '../../providers/pet_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';

class PetScreen extends ConsumerWidget {
  const PetScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pet = ref.watch(petControllerProvider);
    final controller = ref.read(petControllerProvider.notifier);

    String moodFeedback(PetMood mood) => switch (mood) {
          PetMood.happy => 'Feeling cozy and content 💖',
          PetMood.sleepy => 'Needs a nap soon 😴',
          PetMood.hungry => 'Tummy rumbling for snacks 🍓',
          PetMood.playful => 'Bursting with playful energy 🎾',
          PetMood.lonely => 'Could use some attention 🤗',
          PetMood.excited => 'Thrilled to spend time together ✨',
        };

    return CozyScaffold(
      title: '${pet.name} • ${pet.mood.name}',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: Container(width: 180, height: 180, decoration: const BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [Color(0xFFFFB6E1), Color(0xFF8E7CFF)])))
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .scale(begin: const Offset(.95, .95), end: const Offset(1.02, 1.02), duration: 1200.ms),
          ),
          const SizedBox(height: 12),
          Text('Level ${pet.level} • ${pet.stage.name} • XP ${pet.xp}', style: Theme.of(context).textTheme.titleMedium),
          Text(moodFeedback(pet.mood)),
          const SizedBox(height: 16),
          _StatBar(label: 'Hunger', value: pet.hunger),
          _StatBar(label: 'Energy', value: pet.energy),
          _StatBar(label: 'Cleanliness', value: pet.cleanliness),
          _StatBar(label: 'Love', value: pet.love),
          _StatBar(label: 'Happiness', value: pet.happiness),
          const SizedBox(height: 16),
          Card(
            child: ListTile(
              title: Text('Streak ${pet.streak} days'),
              subtitle: Text('Longest streak: ${pet.longestStreak} • ${pet.careActionsToday.length} actions today'),
              trailing: Text('${pet.achievements.length} 🏆'),
            ),
          ),
          const SizedBox(height: 8),
          Text('Daily Quests', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 4),
          for (final q in pet.dailyQuests)
            Card(
              child: ListTile(
                title: Text(q.title),
                subtitle: Text('${q.progress}/${q.target} • +${q.rewardXp} XP • +${q.rewardLove} Love'),
                trailing: Icon(q.completed ? Icons.check_circle : Icons.radio_button_unchecked, color: q.completed ? Colors.green : null),
              ),
            ),
          if (pet.achievements.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text('Achievements', style: Theme.of(context).textTheme.titleMedium),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [for (final a in pet.achievements) Chip(label: Text(a))],
            ),
          ],
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final action in const ['feed', 'play', 'cuddle', 'sleep', 'bathe', 'talk'])
                FilledButton(onPressed: () => controller.act(action), child: Text(action)),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatBar extends StatelessWidget {
  const _StatBar({required this.label, required this.value});
  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('$label $value'),
        LinearProgressIndicator(value: value / 100),
      ]),
    );
  }
}
