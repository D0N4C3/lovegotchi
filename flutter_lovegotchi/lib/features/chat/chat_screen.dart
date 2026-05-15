import 'package:flutter/material.dart';

import '../../shared/widgets/cozy_scaffold.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const CozyScaffold(title: 'Couple Chat', child: Center(child: Text('Realtime chat timeline (Firestore-backed)')));
  }
}
