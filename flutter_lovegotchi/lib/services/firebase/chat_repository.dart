import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/chat_models.dart';
import 'user_repository.dart';

final chatRepositoryProvider = Provider<ChatRepository>((ref) => ChatRepository(ref.watch(firestoreProvider)));

class ChatRepository {
  ChatRepository(this._db);
  final FirebaseFirestore _db;

  Future<String> ensureConversation(String relationshipId, List<String> memberIds) async {
    final ref = _db.collection('conversations').doc(relationshipId);
    await ref.set({
      'id': relationshipId,
      'relationshipId': relationshipId,
      'memberIds': memberIds,
      'typing': {},
      'unread': {},
    }, SetOptions(merge: true));
    return relationshipId;
  }

  Stream<ConversationDoc?> watchConversation(String conversationId) {
    return _db.collection('conversations').doc(conversationId).snapshots().map((snap) {
      if (!snap.exists) return null;
      final d = snap.data()!;
      return ConversationDoc(
        id: d['id'] ?? snap.id,
        relationshipId: d['relationshipId'] ?? '',
        memberIds: List<String>.from(d['memberIds'] ?? const []),
        lastMessage: d['lastMessage'],
        lastMessageAt: DateTime.tryParse(d['lastMessageAt'] ?? ''),
        typing: Map<String, bool>.from(d['typing'] ?? const {}),
        unread: Map<String, int>.from(d['unread'] ?? const {}),
      );
    });
  }

  Stream<List<ChatMessage>> watchMessages(String conversationId) {
    return _db.collection('conversations').doc(conversationId).collection('messages').orderBy('createdAt').snapshots().map((snap) {
      return snap.docs.map((doc) {
        final d = doc.data();
        return ChatMessage(
          id: doc.id,
          conversationId: d['conversationId'] ?? conversationId,
          senderId: d['senderId'] ?? '',
          text: d['text'] ?? '',
          createdAt: DateTime.tryParse(d['createdAt'] ?? '') ?? DateTime.now(),
          status: d['status'] ?? 'sent',
        );
      }).toList(growable: false);
    });
  }

  Future<void> sendMessage({required String conversationId, required String senderId, required String text}) async {
    final clean = text.trim();
    if (clean.isEmpty) return;

    await _db.collection('conversations').doc(conversationId).collection('messages').add({
      'conversationId': conversationId,
      'senderId': senderId,
      'text': clean,
      'createdAt': DateTime.now().toIso8601String(),
      'serverCreatedAt': FieldValue.serverTimestamp(),
      'status': 'sent',
    });

    await _db.collection('conversations').doc(conversationId).update({
      'lastMessage': clean,
      'lastMessageAt': DateTime.now().toIso8601String(),
      'typing.$senderId': false,
    });
  }

  Future<void> setTyping({required String conversationId, required String uid, required bool isTyping}) {
    return _db.collection('conversations').doc(conversationId).update({'typing.$uid': isTyping});
  }
}
