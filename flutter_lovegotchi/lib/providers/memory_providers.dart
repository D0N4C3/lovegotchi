import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/memory_models.dart';
import '../services/firebase/memory_repository.dart';
import 'auth_providers.dart';
import 'user_providers.dart';

final memoriesProvider = StreamProvider<List<MemoryEntry>>((ref) {
  final relationshipId = ref.watch(relationshipProvider).value?.id;
  if (relationshipId == null) return const Stream.empty();
  return ref.watch(memoryRepositoryProvider).watchMemories(relationshipId);
});

final addMemoryControllerProvider = AsyncNotifierProvider<AddMemoryController, void>(AddMemoryController.new);

class AddMemoryController extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> add({required String title, required String note}) async {
    final user = ref.read(authStateChangesProvider).value;
    final relationshipId = ref.read(relationshipProvider).value?.id;
    if (user == null || relationshipId == null) return;

    state = const AsyncLoading();
    state = await AsyncValue.guard(() => ref.read(memoryRepositoryProvider).addMemory(
          relationshipId: relationshipId,
          authorId: user.uid,
          title: title,
          note: note,
        ));
  }
}
