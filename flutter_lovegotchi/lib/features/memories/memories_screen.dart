import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../providers/memory_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';

class MemoriesScreen extends ConsumerStatefulWidget {
  const MemoriesScreen({super.key});

  @override
  ConsumerState<MemoriesScreen> createState() => _MemoriesScreenState();
}

class _MemoriesScreenState extends ConsumerState<MemoriesScreen> {
  final _title = TextEditingController();
  final _note = TextEditingController();

  @override
  void dispose() {
    _title.dispose();
    _note.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final currentUid = ref.watch(authStateChangesProvider).value?.uid;
    final entries = ref.watch(memoriesProvider);
    final saving = ref.watch(addMemoryControllerProvider).isLoading;

    return CozyScaffold(
      title: 'Shared Memories',
      child: Column(
        children: [
          Expanded(
            child: entries.when(
              data: (rows) {
                if (rows.isEmpty) return const Center(child: Text('Add your first memory together ✨'));
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: rows.length,
                  itemBuilder: (context, i) {
                    final m = rows[i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: Icon(m.authorId == currentUid ? Icons.favorite : Icons.favorite_border),
                        title: Text(m.title),
                        subtitle: Text(m.note),
                        trailing: Text('${m.createdAt.month}/${m.createdAt.day}'),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(child: Text('Memories unavailable: $e')),
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
              child: Column(
                children: [
                  TextField(controller: _title, decoration: const InputDecoration(hintText: 'Memory title')),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _note,
                          minLines: 1,
                          maxLines: 3,
                          decoration: const InputDecoration(hintText: 'What happened?'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton.filled(
                        onPressed: saving
                            ? null
                            : () async {
                                await ref.read(addMemoryControllerProvider.notifier).add(title: _title.text, note: _note.text);
                                _title.clear();
                                _note.clear();
                              },
                        icon: const Icon(Icons.add_rounded),
                      ),
                    ],
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
