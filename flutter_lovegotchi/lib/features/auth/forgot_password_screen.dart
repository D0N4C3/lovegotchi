import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class ForgotPasswordScreen extends ConsumerStatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  ConsumerState<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends ConsumerState<ForgotPasswordScreen> {
  final _email = TextEditingController();
  String _feedback = '';

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    return CozyScaffold(
      title: 'Forgot your password?',
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('No worries — we\'ll send a reset link to your inbox.'),
            const SizedBox(height: 14),
            AppTextField(controller: _email, decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 14),
            AppPrimaryButton(
              onPressed: authState.isLoading
                  ? null
                  : () async {
                      setState(() => _feedback = '');
                      final result = await ref.read(authControllerProvider.notifier).sendPasswordReset(_email.text);
                      if (!mounted) return;
                      setState(() => _feedback = result);
                    },
              label: 'Send reset link 💌',
            ),
            if (_feedback.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(_feedback),
            ]
          ],
        ),
      ),
    );
  }
}
