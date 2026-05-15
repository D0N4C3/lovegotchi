enum PetType { blob, fox, bunny, alien, cloudSpirit }

enum OnboardingStep { petType, nameVote, completed }

class UserProfile {
  const UserProfile({
    required this.uid,
    required this.displayName,
    required this.username,
    required this.inviteCode,
    required this.email,
    required this.createdAt,
    this.avatar,
    this.partnerId,
    this.relationshipId,
    this.pushToken,
    this.onboardingCompleted = false,
    this.premium = false,
  });

  final String uid;
  final String displayName;
  final String username;
  final String inviteCode;
  final String? avatar;
  final String email;
  final String? partnerId;
  final String? relationshipId;
  final DateTime createdAt;
  final bool onboardingCompleted;
  final String? pushToken;
  final bool premium;
}

class Relationship {
  const Relationship({
    required this.id,
    required this.members,
    required this.petId,
    required this.createdAt,
    required this.onboardingStep,
    this.petType,
    this.nameSuggestions = const {},
    this.nameApprovals = const {},
  });

  final String id;
  final List<String> members;
  final String petId;
  final DateTime createdAt;
  final OnboardingStep onboardingStep;
  final PetType? petType;
  final Map<String, String> nameSuggestions;
  final Map<String, String> nameApprovals;
}
