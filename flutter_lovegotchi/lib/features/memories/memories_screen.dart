import 'package:flutter/material.dart';

import '../../shared/widgets/cozy_scaffold.dart';

class MemoriesScreen extends StatelessWidget {
  const MemoriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const CozyScaffold(title: 'Shared Memories', child: Center(child: Text('Photos, voice notes, and milestones')));
  }
}
