import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final themeModeProvider = StateProvider<ThemeMode>((_) => ThemeMode.dark);

class AppColors extends ThemeExtension<AppColors> {
  const AppColors({
    required this.background,
    required this.backgroundLight,
    required this.surface,
    required this.surfaceActive,
    required this.surfaceElevated,
    required this.border,
    required this.borderActive,
    required this.primary,
    required this.secondary,
    required this.text,
    required this.textMuted,
    required this.textHint,
    required this.textLight,
    required this.success,
    required this.danger,
    required this.nightSky,
    required this.aurora,
    required this.primaryGradient,
  });

  final Color background;
  final Color backgroundLight;
  final Color surface;
  final Color surfaceActive;
  final Color surfaceElevated;
  final Color border;
  final Color borderActive;
  final Color primary;
  final Color secondary;
  final Color text;
  final Color textMuted;
  final Color textHint;
  final Color textLight;
  final Color success;
  final Color danger;
  final List<Color> nightSky;
  final List<Color> aurora;
  final List<Color> primaryGradient;

  static AppColors of(BuildContext context) => Theme.of(context).extension<AppColors>()!;

  @override
  ThemeExtension<AppColors> copyWith() => this;

  @override
  ThemeExtension<AppColors> lerp(covariant ThemeExtension<AppColors>? other, double t) => this;
}

class AppTheme {
  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    const seed = Color(0xFF7F77DD);
    final scheme = ColorScheme.fromSeed(seedColor: seed, brightness: brightness);
    final isDark = brightness == Brightness.dark;

    final tokens = AppColors(
      background: isDark ? const Color(0xFF1C1529) : const Color(0xFFF8F7FF),
      backgroundLight: isDark ? const Color(0xFF1B1430) : const Color(0xFFEDE9FF),
      surface: isDark ? Colors.white.withValues(alpha: .07) : Colors.white.withValues(alpha: .88),
      surfaceActive: const Color.fromRGBO(127, 119, 221, .10),
      surfaceElevated: isDark ? Colors.white.withValues(alpha: .16) : Colors.white.withValues(alpha: .95),
      border: isDark ? Colors.white.withValues(alpha: .12) : const Color(0x26000000),
      borderActive: const Color.fromRGBO(127, 119, 221, .60),
      primary: const Color(0xFF7F77DD),
      secondary: const Color(0xFFD4537E),
      text: isDark ? const Color(0xFFF0EEF8) : const Color(0xFF31162B),
      textMuted: isDark ? const Color.fromRGBO(240, 238, 248, .45) : const Color(0x9931162B),
      textHint: isDark ? const Color.fromRGBO(240, 238, 248, .30) : const Color(0x6631162B),
      textLight: const Color(0xFFA996BD),
      success: const Color(0xFF8FF0C4),
      danger: const Color(0xFFFF6A8E),
      nightSky: const [Color(0xFF120B23), Color(0xFF1E1539), Color(0xFF2A1E4D)],
      aurora: const [Color.fromRGBO(255, 142, 178, .26), Color.fromRGBO(167, 139, 250, .18), Color.fromRGBO(112, 194, 255, .14)],
      primaryGradient: const [Color(0xFF7F77DD), Color(0xFFD4537E)],
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme.copyWith(primary: tokens.primary),
      scaffoldBackgroundColor: tokens.background,
      textTheme: Typography.material2021().white.apply(bodyColor: tokens.text, displayColor: tokens.text),
      extensions: [tokens],
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: tokens.surface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: tokens.border)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: tokens.border)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: tokens.borderActive)),
        hintStyle: TextStyle(color: tokens.textHint),
        labelStyle: TextStyle(color: tokens.textLight),
      ),
      cardTheme: CardThemeData(
        color: tokens.surface,
        elevation: 0,
        shadowColor: const Color.fromRGBO(7, 3, 18, .8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24), side: BorderSide(color: tokens.border)),
      ),
    );
  }
}
