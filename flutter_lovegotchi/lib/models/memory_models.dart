class MemoryEntry {
  const MemoryEntry({
    required this.id,
    required this.relationshipId,
    required this.authorId,
    required this.title,
    required this.note,
    required this.createdAt,
    this.photoUrl,
    this.voiceUrl,
  });

  final String id;
  final String relationshipId;
  final String authorId;
  final String title;
  final String note;
  final DateTime createdAt;
  final String? photoUrl;
  final String? voiceUrl;
}
