import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../models/app_models.dart';

final firestoreProvider = Provider<FirebaseFirestore>((_) => FirebaseFirestore.instance);
final userRepositoryProvider = Provider<UserRepository>((ref) => UserRepository(ref.watch(firestoreProvider)));

class UserRepository {
  UserRepository(this._db);
  final FirebaseFirestore _db;

  Stream<UserProfile?> watchProfile(String uid) {
    return _db.collection('users').doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      final data = doc.data()!;
      return UserProfile(
        uid: uid,
        displayName: data['displayName'] ?? '',
        username: data['username'] ?? '',
        inviteCode: data['inviteCode'] ?? '',
        email: data['email'] ?? '',
        avatar: data['avatar'],
        partnerId: data['partnerId'],
        relationshipId: data['relationshipId'],
        pushToken: data['pushToken'],
        onboardingCompleted: data['onboardingCompleted'] ?? false,
        premium: data['premium'] ?? false,
        createdAt: DateTime.tryParse(data['createdAt'] ?? '') ?? DateTime.now(),
      );
    });
  }

  Stream<Relationship?> watchRelationship(String relationshipId) {
    return _db.collection('relationships').doc(relationshipId).snapshots().map((doc) {
      if (!doc.exists) return null;
      final data = doc.data()!;
      return Relationship(
        id: doc.id,
        members: List<String>.from(data['members'] ?? const []),
        petId: data['petId'] ?? '',
        createdAt: DateTime.tryParse(data['createdAt'] ?? '') ?? DateTime.now(),
        onboardingStep: _stepFromString(data['onboardingStep'] ?? 'pet_type'),
        petType: _petFromString(data['petType']),
        nameSuggestions: Map<String, String>.from(data['nameSuggestions'] ?? const {}),
        nameApprovals: Map<String, String>.from(data['nameApprovals'] ?? const {}),
      );
    });
  }



  Future<void> updateProfileBasics({required String uid, required String displayName, required String username}) {
    return _db.collection('users').doc(uid).set({
      'displayName': displayName,
      'username': username,
      'inviteCode': username,
    }, SetOptions(merge: true));
  }

  Future<void> setOnboardingStep({required String relationshipId, required OnboardingStep step}) {
    return _db.collection('relationships').doc(relationshipId).set({'onboardingStep': _stepToValue(step)}, SetOptions(merge: true));
  }

  Future<void> invitePartnerByUsername({required String currentUid, required String relationshipId, required String partnerUsername}) async {
    final normalized = partnerUsername.trim().replaceAll('@', '');
    final query = await _db.collection('users').where('username', isEqualTo: normalized).limit(1).get();
    if (query.docs.isEmpty) throw Exception('Could not find that username yet');
    final partnerUid = query.docs.first.id;
    if (partnerUid == currentUid) throw Exception('That is your own username');
    await _db.collection('users').doc(currentUid).set({'partnerId': partnerUid}, SetOptions(merge: true));
    await _db.collection('users').doc(partnerUid).set({'partnerId': currentUid, 'relationshipId': relationshipId}, SetOptions(merge: true));
    await _db.collection('relationships').doc(relationshipId).set({
      'members': FieldValue.arrayUnion([currentUid, partnerUid]),
    }, SetOptions(merge: true));
  }

  Future<void> completeOnboarding({required Relationship relationship, required PetType petType, required String petName}) async {
    final relationshipRef = _db.collection('relationships').doc(relationship.id);
    final petRef = _db.collection('pets').doc(relationship.petId);
    await _db.runTransaction((tx) async {
      tx.set(relationshipRef, {'onboardingStep': 'completed', 'petType': _petTypeToValue(petType)}, SetOptions(merge: true));
      tx.set(petRef, {'petName': petName.trim(), 'petType': _petTypeToValue(petType), 'stage': 'baby'}, SetOptions(merge: true));
      for (final member in relationship.members) {
        tx.set(_db.collection('users').doc(member), {'onboardingCompleted': true}, SetOptions(merge: true));
      }
    });
  }

  Future<void> setPetType(String relationshipId, PetType petType) {
    return _db.collection('relationships').doc(relationshipId).update({
      'petType': _petTypeToValue(petType),
      'onboardingStep': 'name_vote',
    });
  }

  Future<void> suggestName({required String relationshipId, required String uid, required String name}) {
    return _db.collection('relationships').doc(relationshipId).update({'nameSuggestions.$uid': name.trim()});
  }

  Future<void> approveName({required Relationship relationship, required String uid, required String name}) async {
    final ref = _db.collection('relationships').doc(relationship.id);
    await _db.runTransaction((tx) async {
      final current = await tx.get(ref);
      final data = current.data()!;
      final approvals = Map<String, String>.from(data['nameApprovals'] ?? {});
      approvals[uid] = name;
      tx.update(ref, {'nameApprovals': approvals});
      final values = approvals.values.toSet();
      if (approvals.length >= 2 && values.length == 1) {
        tx.update(ref, {'onboardingStep': 'completed'});
        tx.update(_db.collection('pets').doc(relationship.petId), {'petName': name, 'petType': _petTypeToValue(relationship.petType ?? PetType.blob), 'stage': 'baby'});
        for (final member in relationship.members) {
          tx.update(_db.collection('users').doc(member), {'onboardingCompleted': true});
        }
      }
    });
  }

  String _petTypeToValue(PetType petType) => switch (petType) {
        PetType.blob => 'blob',
        PetType.fox => 'fox',
        PetType.bunny => 'bunny',
        PetType.alien => 'alien',
        PetType.cloudSpirit => 'cloud spirit',
      };

  PetType? _petFromString(dynamic value) => switch (value) {
        'blob' => PetType.blob,
        'fox' => PetType.fox,
        'bunny' => PetType.bunny,
        'alien' => PetType.alien,
        'cloud spirit' => PetType.cloudSpirit,
        _ => null,
      };

  String _stepToValue(OnboardingStep step) => switch (step) {
        OnboardingStep.petType => 'pet_type',
        OnboardingStep.nameVote => 'name_vote',
        OnboardingStep.completed => 'completed',
      };

  OnboardingStep _stepFromString(String value) => switch (value) {
        'pet_type' => OnboardingStep.petType,
        'name_vote' => OnboardingStep.nameVote,
        'completed' => OnboardingStep.completed,
        _ => OnboardingStep.petType,
      };
}
