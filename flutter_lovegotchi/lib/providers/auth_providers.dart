import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';

final firebaseAuthProvider = Provider<FirebaseAuth>((_) => FirebaseAuth.instance);

final authStateChangesProvider = StreamProvider<User?>((ref) {
  return ref.watch(firebaseAuthProvider).authStateChanges();
});

final authControllerProvider = AsyncNotifierProvider<AuthController, void>(AuthController.new);

class AuthController extends AsyncNotifier<void> {
  FirebaseAuth get _auth => ref.read(firebaseAuthProvider);

  @override
  FutureOr<void> build() {}

  Future<void> signInWithEmail(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _auth.signInWithEmailAndPassword(email: email, password: password));
  }

  Future<void> signUpWithEmail(String email, String password) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _auth.createUserWithEmailAndPassword(email: email, password: password));
  }

  Future<void> signInWithGoogle() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final account = await GoogleSignIn().signIn();
      final auth = await account?.authentication;
      if (auth == null) throw Exception('Google sign in cancelled');
      final credential = GoogleAuthProvider.credential(accessToken: auth.accessToken, idToken: auth.idToken);
      await _auth.signInWithCredential(credential);
    });
  }

  Future<void> sendPasswordReset(String email) async => _auth.sendPasswordResetEmail(email: email);

  Future<void> signOut() => _auth.signOut();
}
