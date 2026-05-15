import 'package:flutter/material.dart';

import '../../shared/widgets/cozy_scaffold.dart';

class CoupleScreen extends StatelessWidget {
  const CoupleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const CozyScaffold(
      title: 'Our Journey',
      child: Center(
        child: Text(
          'Track your shared milestones, invitations, and next steps together.',
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
