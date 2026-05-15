class ConversationDoc {
  const ConversationDoc({
    required this.id,
    required this.relationshipId,
    required this.memberIds,
    this.lastMessage,
    this.lastMessageAt,
    this.typing = const {},
    this.unread = const {},
  });

  final String id;
  final String relationshipId;
  final List<String> memberIds;
  final String? lastMessage;
  final DateTime? lastMessageAt;
  final Map<String, bool> typing;
  final Map<String, int> unread;
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.text,
    required this.createdAt,
    required this.status,
  });

  final String id;
  final String conversationId;
  final String senderId;
  final String text;
  final DateTime createdAt;
  final String status;
}
