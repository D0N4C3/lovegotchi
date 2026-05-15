import 'dart:ui';

import 'package:flutter/material.dart';

import '../../theme/app_theme.dart';

class AmbientBackground extends StatelessWidget {
  const AmbientBackground({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    return Stack(
      fit: StackFit.expand,
      children: [
        DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(colors: colors.nightSky, begin: Alignment.topLeft, end: Alignment.bottomRight))),
        DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(colors: colors.aurora, begin: const Alignment(-.6, -1), end: const Alignment(.6, 1))),),
        const _Orb(color: Color.fromRGBO(255, 132, 175, .22), size: 250, top: .08, left: -.15),
        const _Orb(color: Color.fromRGBO(167, 139, 250, .2), size: 280, top: .34, left: .62),
        const _Orb(color: Color.fromRGBO(112, 194, 255, .15), size: 210, top: .72, left: .18),
      ],
    );
  }
}

class _Orb extends StatelessWidget {
  const _Orb({required this.color, required this.size, required this.top, required this.left});
  final Color color;
  final double size;
  final double top;
  final double left;

  @override
  Widget build(BuildContext context) => Positioned(
        top: MediaQuery.sizeOf(context).height * top,
        left: MediaQuery.sizeOf(context).width * left,
        child: Container(width: size, height: size, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      );
}

class GlassCard extends StatelessWidget {
  const GlassCard({super.key, required this.child, this.padding = const EdgeInsets.all(16)});
  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: colors.border.withValues(alpha: .5)),
            gradient: LinearGradient(colors: [Colors.white.withValues(alpha: .2), Colors.white.withValues(alpha: .04)]),
            color: colors.surfaceElevated.withValues(alpha: .5),
          ),
          child: child,
        ),
      ),
    );
  }
}

class AppPrimaryButton extends StatelessWidget {
  const AppPrimaryButton({super.key, required this.label, this.onPressed, this.expand = true});
  final String label;
  final VoidCallback? onPressed;
  final bool expand;

  @override
  Widget build(BuildContext context) {
    final colors = AppColors.of(context);
    final button = DecoratedBox(
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), gradient: LinearGradient(colors: colors.primaryGradient)),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 14),
            child: Center(child: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700))),
          ),
        ),
      ),
    );
    return Opacity(opacity: onPressed == null ? .5 : 1, child: expand ? SizedBox(width: double.infinity, child: button) : button);
  }
}

class AppTextField extends StatelessWidget {
  const AppTextField({super.key, required this.controller, this.decoration, this.obscureText = false, this.minLines, this.maxLines, this.onChanged});
  final TextEditingController controller;
  final InputDecoration? decoration;
  final bool obscureText;
  final int? minLines;
  final int? maxLines;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) => TextField(
        controller: controller,
        obscureText: obscureText,
        minLines: minLines,
        maxLines: maxLines,
        onChanged: onChanged,
        decoration: decoration,
      );
}

Future<bool> showConfirmDialog(BuildContext context, {required String title, required String message, String confirmLabel = 'Confirm'}) async {
  return (await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
            FilledButton(onPressed: () => Navigator.pop(context, true), child: Text(confirmLabel)),
          ],
        ),
      )) ??
      false;
}
