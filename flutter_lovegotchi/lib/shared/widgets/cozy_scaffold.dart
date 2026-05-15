import 'package:flutter/material.dart';

import 'app_primitives.dart';

class CozyScaffold extends StatelessWidget {
  const CozyScaffold({super.key, required this.child, this.title});

  final Widget child;
  final String? title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const AmbientBackground(),
          SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 760),
                child: Column(
                  children: [
                    if (title != null)
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Text(title!, style: Theme.of(context).textTheme.headlineSmall),
                      ),
                    Expanded(child: child),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
