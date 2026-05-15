import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../providers/auth_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});
  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authControllerProvider);
    return CozyScaffold(
      title: 'Welcome back 💜',
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            AppTextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 12),
            AppTextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
            const SizedBox(height: 20),
            AppPrimaryButton(
              onPressed: state.isLoading ? null : () => ref.read(authControllerProvider.notifier).signInWithEmail(email.text, password.text.trim()),
              label: 'Log In',
            ),
            TextButton(onPressed: () => context.go('/auth/forgot-password'), child: const Text('Forgot password?')),
            TextButton(onPressed: () => context.go('/auth/signup'), child: const Text('Create account')),
            OutlinedButton(onPressed: () => ref.read(authControllerProvider.notifier).signInWithGoogle(), child: const Text('Continue with Google')),
          ],
        ),
      ),
    );
  }
}
