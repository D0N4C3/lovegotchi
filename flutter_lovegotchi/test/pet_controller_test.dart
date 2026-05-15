import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lovegotchi/models/pet_models.dart';
import 'package:lovegotchi/providers/pet_providers.dart';

void main() {
  ProviderContainer makeContainer() => ProviderContainer();

  test('daily reset updates streak and applies decay', () {
    final container = makeContainer();
    final controller = container.read(petControllerProvider.notifier);
    final start = DateTime.utc(2026, 5, 15, 10);
    controller.nowProvider = () => start;

    controller.state = container.read(petControllerProvider).copyWith(
          careActionsToday: const ['feed'],
          streak: 2,
          longestStreak: 2,
          hunger: 50,
          energy: 50,
          cleanliness: 50,
          love: 50,
          happiness: 50,
          lastCareReset: '2026-05-14',
        );

    controller.checkDailyReset();
    final next = container.read(petControllerProvider);
    expect(next.streak, 3);
    expect(next.longestStreak, 3);
    expect(next.careActionsToday, isEmpty);
    expect(next.hunger, 38);
    expect(next.lastCareReset, '2026-05-15');
  });

  test('game tick decays stats and mood from elapsed hours', () {
    final container = makeContainer();
    final controller = container.read(petControllerProvider.notifier);
    final now = DateTime.utc(2026, 5, 15, 12);
    controller.nowProvider = () => now;

    controller.state = container.read(petControllerProvider).copyWith(
          hunger: 40,
          energy: 20,
          cleanliness: 40,
          love: 40,
          happiness: 40,
          lastInteractionAt: now.subtract(const Duration(hours: 2)).millisecondsSinceEpoch,
        );

    controller.runGameTick();
    final next = container.read(petControllerProvider);
    expect(next.hunger, 28);
    expect(next.energy, 12);
    expect(next.cleanliness, 34);
    expect(next.mood, PetMood.hungry);
  });

  test('quests complete once and level progression maps stage', () {
    final container = makeContainer();
    final controller = container.read(petControllerProvider.notifier);
    controller.nowProvider = () => DateTime.utc(2026, 5, 15, 10);

    controller.state = container.read(petControllerProvider).copyWith(xp: 390, level: 4, stage: PetStage.baby);
    controller.act('cuddle');
    controller.act('talk');
    controller.act('play');

    final next = container.read(petControllerProvider);
    expect(next.dailyQuests.every((q) => q.completed), isTrue);
    expect(next.level, 6);
    expect(next.stage, PetStage.child);
    final questXp = next.dailyQuests.fold<int>(0, (sum, q) => sum + q.rewardXp);
    expect(next.xp, 390 + 12 + 8 + 20 + questXp);
  });
}
