import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../shared/widgets/cozy_scaffold.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CozyScaffold(
      title: 'Meet Mochi',
      child: Center(
        child: FilledButton(
          onPressed: () => context.go('/'),
          child: const Text('Start our Lovegotchi journey'),
        ),
      ),
    );
  }
}
