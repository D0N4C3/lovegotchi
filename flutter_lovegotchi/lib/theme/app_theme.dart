import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final themeModeProvider = StateProvider<ThemeMode>((_) => ThemeMode.dark);

class AppTheme {
  static const _seed = Color(0xFF8E7CFF);

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final scheme = ColorScheme.fromSeed(seedColor: _seed, brightness: brightness);
    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      scaffoldBackgroundColor: brightness == Brightness.dark ? const Color(0xFF0F1022) : const Color(0xFFF8F7FF),
      textTheme: Typography.material2021().white.apply(
            bodyColor: brightness == Brightness.dark ? Colors.white : const Color(0xFF1D1740),
            displayColor: brightness == Brightness.dark ? Colors.white : const Color(0xFF1D1740),
          ),
      cardTheme: CardThemeData(
        color: brightness == Brightness.dark ? const Color(0xAA1D1A3A) : Colors.white.withValues(alpha: .85),
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }
}
