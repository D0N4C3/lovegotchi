import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/go_router_refresh_stream.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/chat/chat_screen.dart';
import '../features/home/home_shell.dart';
import '../features/memories/memories_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/pet/pet_screen.dart';
import '../features/profile/profile_screen.dart';
import '../providers/auth_providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authStateChangesProvider);
  return GoRouter(
    initialLocation: '/auth/login',
    refreshListenable: GoRouterRefreshStream(ref.watch(authStateChangesProvider.stream)),
    redirect: (context, state) {
      final isAuthed = auth.value != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      if (!isAuthed && !isAuthRoute) return '/auth/login';
      if (isAuthed && isAuthRoute) return '/onboarding';
      return null;
    },
    routes: [
      GoRoute(path: '/auth/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/auth/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      StatefulShellRoute.indexedStack(
        builder: (_, __, navShell) => HomeShell(navigationShell: navShell),
        branches: [
          StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const PetScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/chat', builder: (_, __) => const ChatScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/memories', builder: (_, __) => const MemoriesScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen())]),
        ],
      ),
    ],
  );
});
