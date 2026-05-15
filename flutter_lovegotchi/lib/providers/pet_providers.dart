import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/pet_models.dart';

const _storageKey = 'lovegotchi-pet-storage';

List<DailyQuest> buildQuests() => const [
      DailyQuest(id: DailyQuestId.dailyCare, title: 'Complete 3 care rituals', target: 3, progress: 0, rewardXp: 30, rewardLove: 5, completed: false),
      DailyQuest(id: DailyQuestId.bondingTime, title: 'Use cuddle/talk 2 times', target: 2, progress: 0, rewardXp: 25, rewardLove: 10, completed: false),
      DailyQuest(id: DailyQuestId.playDate, title: 'Play once', target: 1, progress: 0, rewardXp: 20, rewardLove: 4, completed: false),
    ];

String todayKey() => DateTime.now().toIso8601String().split('T').first;
int clamp(int value) => value.clamp(0, 100);

final petControllerProvider = NotifierProvider<PetController, PetState>(PetController.new);

class PetController extends Notifier<PetState> {
  @override
  PetState build() {
    _hydrate();
    return PetState(
      name: 'Mochi', stage: PetStage.egg, mood: PetMood.happy, hunger: 70, energy: 80, cleanliness: 70, love: 60, happiness: 75, xp: 0, level: 1,
      streak: 0, longestStreak: 0, lastInteraction: null, lastInteractionAt: DateTime.now().millisecondsSinceEpoch, memories: const [], decorations: const ['bed', 'lamp'],
      careActionsToday: const [], lastCareReset: todayKey(), achievements: const [], dailyQuests: buildQuests(), isCreated: false,
    );
  }

  Future<void> _hydrate() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_storageKey);
    if (raw == null) return;
    final parsed = PetState.fromJson(raw, buildQuests());
    if (parsed != null) state = parsed;
  }

  Future<void> _persist() async => (await SharedPreferences.getInstance()).setString(_storageKey, state.toJson());

  void runGameTick() {
    final elapsedHours = (DateTime.now().millisecondsSinceEpoch - state.lastInteractionAt) / (1000 * 60 * 60);
    if (elapsedHours < 1) return;
    final decay = elapsedHours.floor();
    final hunger = clamp(state.hunger - decay * 6);
    final energy = clamp(state.energy - decay * 4);
    final cleanliness = clamp(state.cleanliness - decay * 3);
    final love = clamp(state.love - (hunger < 30 ? decay * 2 : decay));
    final happiness = clamp(state.happiness - (energy < 30 ? decay * 3 : decay * 2));
    var mood = PetMood.happy;
    if (hunger < 30) mood = PetMood.hungry;
    if (energy < 30) mood = PetMood.sleepy;
    if (love < 35) mood = PetMood.lonely;
    state = state.copyWith(hunger: hunger, energy: energy, cleanliness: cleanliness, love: love, happiness: happiness, mood: mood, lastInteractionAt: DateTime.now().millisecondsSinceEpoch);
    _persist();
  }

  void act(String action) {
    if (state.careActionsToday.contains(action)) return;
    var next = state;
    switch (action) {
      case 'feed': next = state.copyWith(hunger: clamp(state.hunger + 25), happiness: clamp(state.happiness + 6), love: clamp(state.love + 3), xp: state.xp + 15, mood: PetMood.happy); break;
      case 'play': next = state.copyWith(happiness: clamp(state.happiness + 22), energy: clamp(state.energy - 15), cleanliness: clamp(state.cleanliness - 8), love: clamp(state.love + 5), xp: state.xp + 20, mood: PetMood.playful); break;
      case 'cuddle': next = state.copyWith(love: clamp(state.love + 20), happiness: clamp(state.happiness + 10), energy: clamp(state.energy + 4), xp: state.xp + 12, mood: PetMood.excited); break;
      case 'sleep': next = state.copyWith(energy: clamp(state.energy + 30), hunger: clamp(state.hunger - 10), cleanliness: clamp(state.cleanliness + 6), xp: state.xp + 10, mood: PetMood.sleepy); break;
      case 'bathe': next = state.copyWith(cleanliness: clamp(state.cleanliness + 30), happiness: clamp(state.happiness + 15), love: clamp(state.love + 5), xp: state.xp + 12, mood: PetMood.happy); break;
      case 'talk': next = state.copyWith(love: clamp(state.love + 15), happiness: clamp(state.happiness + 8), xp: state.xp + 8, mood: PetMood.excited); break;
    }
    final care = [...state.careActionsToday, action];
    state = next.copyWith(careActionsToday: care, lastInteractionAt: DateTime.now().millisecondsSinceEpoch);
    _applyXpAndQuests();
    _persist();
  }

  void _applyXpAndQuests() {
    final quests = state.dailyQuests.map((q) {
      final progress = switch (q.id) {
        DailyQuestId.dailyCare => state.careActionsToday.length,
        DailyQuestId.bondingTime => state.careActionsToday.where((a) => a == 'cuddle' || a == 'talk').length,
        DailyQuestId.playDate => state.careActionsToday.where((a) => a == 'play').length,
      };
      return q.copyWith(progress: progress > q.target ? q.target : progress, completed: progress >= q.target);
    }).toList();
    final bonusXp = quests.where((q) => q.completed).fold(0, (a, b) => a + b.rewardXp);
    final bonusLove = quests.where((q) => q.completed).fold(0, (a, b) => a + b.rewardLove);
    final totalXp = state.xp + bonusXp;
    final level = (totalXp ~/ 100) + 1;
    final stage = level >= 20 ? PetStage.legendary : level >= 15 ? PetStage.adult : level >= 10 ? PetStage.teen : level >= 5 ? PetStage.child : PetStage.baby;
    state = state.copyWith(dailyQuests: quests, xp: totalXp, love: clamp(state.love + bonusLove), level: level, stage: stage);
  }
}
