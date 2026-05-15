import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../providers/chat_providers.dart';
import '../../services/firebase/chat_repository.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class ChatScreen extends ConsumerStatefulWidget {
  const ChatScreen({super.key});

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final _controller = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final currentUid = ref.watch(authStateChangesProvider).value?.uid;
    final messages = ref.watch(messagesProvider);
    final sending = ref.watch(sendMessageControllerProvider).isLoading;

    return CozyScaffold(
      title: 'Couple Chat',
      child: Column(
        children: [
          Expanded(
            child: messages.when(
              data: (rows) {
                if (rows.isEmpty) return const Center(child: Text('Say hi to your partner 💜'));
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: rows.length,
                  itemBuilder: (context, index) {
                    final row = rows[index];
                    final mine = row.senderId == currentUid;
                    return Align(
                      alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        constraints: const BoxConstraints(maxWidth: 280),
                        decoration: BoxDecoration(
                          color: mine ? const Color(0xFF8E7CFF) : const Color(0x55252540),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(row.text),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Chat unavailable: $e')),
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: AppTextField(
                      controller: _controller,
                      minLines: 1,
                      maxLines: 4,
                      onChanged: (value) {
                        final conversationId = ref.read(conversationIdProvider).value;
                        final uid = ref.read(authStateChangesProvider).value?.uid;
                        if (conversationId != null && uid != null) {
                          ref.read(chatRepositoryProvider).setTyping(conversationId: conversationId, uid: uid, isTyping: value.trim().isNotEmpty);
                        }
                      },
                      decoration: const InputDecoration(hintText: 'Send love note...'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.filled(
                    onPressed: sending
                        ? null
                        : () async {
                            await ref.read(sendMessageControllerProvider.notifier).send(_controller.text);
                            _controller.clear();
                          },
                    icon: const Icon(Icons.send_rounded),
                  ),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
