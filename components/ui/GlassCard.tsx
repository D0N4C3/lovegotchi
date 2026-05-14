import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function GlassCard({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.wrap, style]} {...props}>
      <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={["rgba(255,255,255,0.20)", "rgba(255,255,255,0.04)"]} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#090014',
    shadowOpacity: 0.35,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
});
