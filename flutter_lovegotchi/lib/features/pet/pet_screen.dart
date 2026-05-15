import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/pet_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';

class PetScreen extends ConsumerWidget {
  const PetScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pet = ref.watch(petControllerProvider);
    final controller = ref.read(petControllerProvider.notifier);

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
          const SizedBox(height: 16),
          Text('Level ${pet.level} • ${pet.stage.name} • XP ${pet.xp}'),
          const SizedBox(height: 10),
          LinearProgressIndicator(value: pet.hunger / 100),
          Text('Hunger ${pet.hunger}'),
          LinearProgressIndicator(value: pet.energy / 100),
          Text('Energy ${pet.energy}'),
          const SizedBox(height: 16),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final action in const ['feed', 'play', 'cuddle', 'sleep', 'bathe', 'talk'])
              FilledButton(onPressed: () => controller.act(action), child: Text(action)),
          ]),
        ],
      ),
    );
  }
}
