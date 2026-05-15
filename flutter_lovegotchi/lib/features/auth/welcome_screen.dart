import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../shared/widgets/cozy_scaffold.dart';
import '../../shared/widgets/app_primitives.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CozyScaffold(
      title: 'Lovegotchi',
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Spacer(),
            const Text('🐾', style: TextStyle(fontSize: 72)),
            const SizedBox(height: 12),
            const Text(
              'Grow love, one tiny\nmoment at a time.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 10),
            const Text(
              'A cozy home for two hearts and one adorable digital companion.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 18),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: const [
                _TagChip('🏡 shared home'),
                _TagChip('💞 couple streaks'),
                _TagChip('🌱 evolve together'),
              ],
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: AppPrimaryButton(onPressed: () => context.go('/auth/login'), label: 'Continue →'),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => context.go('/auth/signup'),
                child: const Text('Create account'),
              ),
            ),
            const SizedBox(height: 8),
            const Text('By continuing you agree to our Terms & Privacy', style: TextStyle(fontSize: 11)),
          ],
        ),
      ),
    );
  }
}

class _TagChip extends StatelessWidget {
  const _TagChip(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(99),
        border: Border.all(color: colors.border),
        color: colors.surface,
      ),
      child: Text(label, style: const TextStyle(fontSize: 12)),
    );
  }
}
