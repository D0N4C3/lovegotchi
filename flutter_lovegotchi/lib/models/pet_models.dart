import 'dart:convert';

enum PetMood { happy, sleepy, hungry, playful, lonely, excited }
enum PetStage { egg, baby, child, teen, adult, legendary }
enum MemoryType { photo, voice, text }
enum DailyQuestId { dailyCare, bondingTime, playDate }

class PetMemory {
  const PetMemory({required this.id, required this.title, required this.date, required this.type, required this.content, required this.partnerName});
  final String id;
  final String title;
  final String date;
  final MemoryType type;
  final String content;
  final String partnerName;
}

class DailyQuest {
  const DailyQuest({required this.id, required this.title, required this.target, required this.progress, required this.rewardXp, required this.rewardLove, required this.completed});
  final DailyQuestId id;
  final String title;
  final int target;
  final int progress;
  final int rewardXp;
  final int rewardLove;
  final bool completed;

  DailyQuest copyWith({int? progress, bool? completed}) => DailyQuest(
        id: id,
        title: title,
        target: target,
        progress: progress ?? this.progress,
        rewardXp: rewardXp,
        rewardLove: rewardLove,
        completed: completed ?? this.completed,
      );
}

class PetState {
  const PetState({
    required this.name,
    required this.stage,
    required this.mood,
    required this.hunger,
    required this.energy,
    required this.cleanliness,
    required this.love,
    required this.happiness,
    required this.xp,
    required this.level,
    required this.streak,
    required this.longestStreak,
    required this.lastInteraction,
    required this.lastInteractionAt,
    required this.memories,
    required this.decorations,
    required this.careActionsToday,
    required this.lastCareReset,
    required this.achievements,
    required this.dailyQuests,
    required this.isCreated,
  });

  final String name;
  final PetStage stage;
  final PetMood mood;
  final int hunger;
  final int energy;
  final int cleanliness;
  final int love;
  final int happiness;
  final int xp;
  final int level;
  final int streak;
  final int longestStreak;
  final String? lastInteraction;
  final int lastInteractionAt;
  final List<PetMemory> memories;
  final List<String> decorations;
  final List<String> careActionsToday;
  final String lastCareReset;
  final List<String> achievements;
  final List<DailyQuest> dailyQuests;
  final bool isCreated;

  PetState copyWith({
    String? name,
    PetStage? stage,
    PetMood? mood,
    int? hunger,
    int? energy,
    int? cleanliness,
    int? love,
    int? happiness,
    int? xp,
    int? level,
    int? streak,
    int? longestStreak,
    String? lastInteraction,
    int? lastInteractionAt,
    List<PetMemory>? memories,
    List<String>? decorations,
    List<String>? careActionsToday,
    String? lastCareReset,
    List<String>? achievements,
    List<DailyQuest>? dailyQuests,
    bool? isCreated,
  }) => PetState(
    name: name ?? this.name, stage: stage ?? this.stage, mood: mood ?? this.mood, hunger: hunger ?? this.hunger, energy: energy ?? this.energy,
    cleanliness: cleanliness ?? this.cleanliness, love: love ?? this.love, happiness: happiness ?? this.happiness, xp: xp ?? this.xp, level: level ?? this.level,
    streak: streak ?? this.streak, longestStreak: longestStreak ?? this.longestStreak, lastInteraction: lastInteraction ?? this.lastInteraction,
    lastInteractionAt: lastInteractionAt ?? this.lastInteractionAt, memories: memories ?? this.memories, decorations: decorations ?? this.decorations,
    careActionsToday: careActionsToday ?? this.careActionsToday, lastCareReset: lastCareReset ?? this.lastCareReset, achievements: achievements ?? this.achievements,
    dailyQuests: dailyQuests ?? this.dailyQuests, isCreated: isCreated ?? this.isCreated,
  );

  String toJson() => jsonEncode({'name': name, 'stage': stage.name, 'mood': mood.name, 'hunger': hunger, 'energy': energy, 'cleanliness': cleanliness, 'love': love, 'happiness': happiness, 'xp': xp, 'level': level, 'streak': streak, 'longestStreak': longestStreak, 'lastInteraction': lastInteraction, 'lastInteractionAt': lastInteractionAt, 'decorations': decorations, 'careActionsToday': careActionsToday, 'lastCareReset': lastCareReset, 'achievements': achievements, 'isCreated': isCreated});

  static PetState? fromJson(String raw, List<DailyQuest> quests) {
    final d = jsonDecode(raw) as Map<String, dynamic>;
    return PetState(name: d['name'] ?? 'Mochi', stage: PetStage.values.byName(d['stage'] ?? 'egg'), mood: PetMood.values.byName(d['mood'] ?? 'happy'), hunger: d['hunger'] ?? 70, energy: d['energy'] ?? 80, cleanliness: d['cleanliness'] ?? 70, love: d['love'] ?? 60, happiness: d['happiness'] ?? 75, xp: d['xp'] ?? 0, level: d['level'] ?? 1, streak: d['streak'] ?? 0, longestStreak: d['longestStreak'] ?? 0, lastInteraction: d['lastInteraction'], lastInteractionAt: d['lastInteractionAt'] ?? DateTime.now().millisecondsSinceEpoch, memories: const [], decorations: List<String>.from(d['decorations'] ?? const ['bed', 'lamp']), careActionsToday: List<String>.from(d['careActionsToday'] ?? const []), lastCareReset: d['lastCareReset'] ?? '', achievements: List<String>.from(d['achievements'] ?? const []), dailyQuests: quests, isCreated: d['isCreated'] ?? false);
  }
}
