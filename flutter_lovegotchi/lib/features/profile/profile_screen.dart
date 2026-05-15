import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../providers/auth_providers.dart';
import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return CozyScaffold(
      title: 'Profile',
      child: Center(
        child: AppPrimaryButton(
          onPressed: () => ref.read(authControllerProvider.notifier).signOut(),
          label: 'Sign out',
        ),
      ),
    );
  }
}
