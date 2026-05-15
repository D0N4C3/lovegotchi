import 'package:flutter/material.dart';

class CozyScaffold extends StatelessWidget {
  const CozyScaffold({super.key, required this.child, this.title});

  final Widget child;
  final String? title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF11152B), Color(0xFF2A1E54), Color(0xFF4A2D74)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
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
    );
  }
}
