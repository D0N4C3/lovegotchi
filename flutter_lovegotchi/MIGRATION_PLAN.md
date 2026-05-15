# Lovegotchi React Native → Flutter Migration

## What has been migrated in this commit

- New Flutter app scaffold with Dart 3, Material 3, Riverpod, GoRouter, FlutterFire packages.
- Feature-first folder structure aligned with long-term scale.
- Auth flow foundation (email/password + Google sign in + sign out + auth stream).
- Router with auth guards and post-auth onboarding gate.
- Premium visual baseline via cozy gradient shell and animated pet landing interaction.
- Placeholder feature surfaces for Pet, Chat, Memories, and Profile to map all core tabs.

## Source-to-target mapping

- Expo Router `app/**` → GoRouter routes and nested `StatefulShellRoute`.
- Zustand/store `store/authStore.ts`, `store/petStore.ts` → Riverpod notifiers/providers.
- Firebase JS services `services/**` → FlutterFire services/providers.
- Reusable RN components `components/**` → shared Flutter widgets in `lib/shared/widgets`.

## Next implementation slices

1. Firestore repositories for chat/memory/pet stats with Freezed DTOs.
2. Onboarding multi-step flow parity with partner linking and pet creation.
3. Pet state machine + Rive integration + touch/squish physics.
4. Full design system tokens: spacing, elevation, gradients, glow, typography scale.
5. Push notifications, analytics events, and cloud function client calls.
6. QA: golden tests, widget tests, and performance profiling (frame budget).
