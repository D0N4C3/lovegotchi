import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class SignupScreen extends ConsumerWidget {
  const SignupScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final email = TextEditingController();
    final password = TextEditingController();
    return CozyScaffold(
      title: 'Create your couple nest ✨',
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(children: [
          AppTextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
          const SizedBox(height: 12),
          AppTextField(controller: password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
          const SizedBox(height: 20),
          AppPrimaryButton(onPressed: () => ref.read(authControllerProvider.notifier).signUpWithEmail(email.text.trim(), password.text.trim()), label: 'Sign up'),
        ]),
      ),
    );
  }
}
