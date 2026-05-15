import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../core/go_router_refresh_stream.dart';
import '../features/auth/forgot_password_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/signup_screen.dart';
import '../features/auth/welcome_screen.dart';
import '../features/chat/chat_screen.dart';
import '../features/couple/couple_screen.dart';
import '../features/home/home_shell.dart';
import '../features/memories/memories_screen.dart';
import '../features/onboarding/onboarding_screen.dart';
import '../features/pet/pet_screen.dart';
import '../features/profile/profile_screen.dart';
import '../providers/auth_providers.dart';
import '../providers/user_providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final auth = ref.watch(authStateChangesProvider);
  final profile = ref.watch(profileProvider);
  final relationship = ref.watch(relationshipProvider);
  return GoRouter(
    initialLocation: '/auth/welcome',
    refreshListenable: Listenable.merge([
      GoRouterRefreshStream(ref.watch(authStateChangesProvider.stream)),
      GoRouterRefreshStream(ref.watch(profileProvider.stream)),
      GoRouterRefreshStream(ref.watch(relationshipProvider.stream)),
    ]),
    redirect: (context, state) {
      final isAuthed = auth.value != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      final isOnboardingRoute = state.matchedLocation.startsWith('/onboarding');

      if (!isAuthed) {
        return isAuthRoute ? null : '/auth/welcome';
      }

      if (profile.isLoading || relationship.isLoading) {
        return null;
      }

      final profileData = profile.value;
      final relationshipData = relationship.value;
      final needsPartner = profileData == null || (profileData.partnerId == null || profileData.partnerId!.isEmpty);
      final relationshipIncomplete = relationshipData == null || relationshipData.onboardingStep != OnboardingStep.completed;
      final needsOnboarding = needsPartner || !profileData.onboardingCompleted || relationshipIncomplete;

      if (needsOnboarding) {
        return isOnboardingRoute ? null : '/onboarding';
      }

      if (isAuthRoute || isOnboardingRoute) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(path: '/auth/welcome', builder: (_, __) => const WelcomeScreen()),
      GoRoute(path: '/auth/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/auth/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),
      GoRoute(path: '/auth/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(path: '/onboarding', builder: (_, __) => const OnboardingScreen()),
      StatefulShellRoute.indexedStack(
        builder: (_, __, navShell) => HomeShell(navigationShell: navShell),
        branches: [
          StatefulShellBranch(routes: [GoRoute(path: '/', builder: (_, __) => const PetScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/chat', builder: (_, __) => const ChatScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/memories', builder: (_, __) => const MemoriesScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/couple', builder: (_, __) => const CoupleScreen())]),
          StatefulShellBranch(routes: [GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen())]),
        ],
      ),
    ],
  );
});
