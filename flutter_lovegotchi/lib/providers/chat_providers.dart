import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/chat_models.dart';
import '../services/firebase/chat_repository.dart';
import 'auth_providers.dart';
import 'user_providers.dart';

final conversationIdProvider = FutureProvider<String?>((ref) async {
  final relationship = ref.watch(relationshipProvider).value;
  if (relationship == null) return null;
  final chatRepo = ref.watch(chatRepositoryProvider);
  return chatRepo.ensureConversation(relationship.id, relationship.members);
});

final conversationProvider = StreamProvider<ConversationDoc?>((ref) {
  final conversationId = ref.watch(conversationIdProvider).value;
  if (conversationId == null) return const Stream.empty();
  return ref.watch(chatRepositoryProvider).watchConversation(conversationId);
});

final messagesProvider = StreamProvider<List<ChatMessage>>((ref) {
  final conversationId = ref.watch(conversationIdProvider).value;
  if (conversationId == null) return const Stream.empty();
  return ref.watch(chatRepositoryProvider).watchMessages(conversationId);
});

final sendMessageControllerProvider = AsyncNotifierProvider<SendMessageController, void>(SendMessageController.new);

class SendMessageController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> send(String text) async {
    final user = ref.read(authStateChangesProvider).value;
    final conversationId = ref.read(conversationIdProvider).value;
    if (user == null || conversationId == null) return;
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(chatRepositoryProvider).sendMessage(conversationId: conversationId, senderId: user.uid, text: text));
  }
}
