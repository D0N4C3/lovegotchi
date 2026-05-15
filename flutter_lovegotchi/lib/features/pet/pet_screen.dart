import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../shared/widgets/cozy_scaffold.dart';

class PetScreen extends StatelessWidget {
  const PetScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CozyScaffold(
      title: 'Mochi is feeling loved',
      child: Center(
        child: Container(
          width: 180,
          height: 180,
          decoration: const BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [Color(0xFFFFB6E1), Color(0xFF8E7CFF)])),
        )
            .animate(onPlay: (controller) => controller.repeat(reverse: true))
            .scale(begin: const Offset(.95, .95), end: const Offset(1.02, 1.02), duration: 1200.ms)
            .shimmer(duration: 2500.ms),
      ),
    );
  }
}
