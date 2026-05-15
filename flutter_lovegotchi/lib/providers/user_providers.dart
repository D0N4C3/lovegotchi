import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/app_models.dart';
import '../services/firebase/user_repository.dart';
import 'auth_providers.dart';

final profileProvider = StreamProvider<UserProfile?>((ref) {
  final user = ref.watch(authStateChangesProvider).value;
  if (user == null) return const Stream.empty();
  return ref.watch(userRepositoryProvider).watchProfile(user.uid);
});

final relationshipProvider = StreamProvider<Relationship?>((ref) {
  final relationshipId = ref.watch(profileProvider).value?.relationshipId;
  if (relationshipId == null || relationshipId.isEmpty) return const Stream.empty();
  return ref.watch(userRepositoryProvider).watchRelationship(relationshipId);
});
