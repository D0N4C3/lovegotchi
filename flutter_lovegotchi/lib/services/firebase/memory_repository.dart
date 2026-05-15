import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/memory_models.dart';
import 'user_repository.dart';

final memoryRepositoryProvider = Provider<MemoryRepository>((ref) => MemoryRepository(ref.watch(firestoreProvider)));

class MemoryRepository {
  MemoryRepository(this._db);
  final FirebaseFirestore _db;

  Stream<List<MemoryEntry>> watchMemories(String relationshipId) {
    return _db
        .collection('relationships')
        .doc(relationshipId)
        .collection('memories')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snap) {
      return snap.docs.map((doc) {
        final d = doc.data();
        return MemoryEntry(
          id: doc.id,
          relationshipId: relationshipId,
          authorId: d['authorId'] ?? '',
          title: d['title'] ?? '',
          note: d['note'] ?? '',
          createdAt: DateTime.tryParse(d['createdAt'] ?? '') ?? DateTime.now(),
          photoUrl: d['photoUrl'],
          voiceUrl: d['voiceUrl'],
        );
      }).toList(growable: false);
    });
  }

  Future<void> addMemory({required String relationshipId, required String authorId, required String title, required String note}) async {
    final cleanTitle = title.trim();
    final cleanNote = note.trim();
    if (cleanTitle.isEmpty || cleanNote.isEmpty) return;

    await _db.collection('relationships').doc(relationshipId).collection('memories').add({
      'authorId': authorId,
      'title': cleanTitle,
      'note': cleanNote,
      'createdAt': DateTime.now().toIso8601String(),
      'serverCreatedAt': FieldValue.serverTimestamp(),
      'photoUrl': null,
      'voiceUrl': null,
    });
  }
}
