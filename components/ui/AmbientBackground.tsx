import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/colors';

function Orb({ color, size, top, left, duration }: { color: string; size: number; top: string; left: string; duration: number }) {
  const y = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    y.value = withRepeat(withSequence(withTiming(-22, { duration, easing: Easing.inOut(Easing.sin) }), withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })), -1, false);
    scale.value = withRepeat(withSequence(withTiming(1.08, { duration: duration + 300 }), withTiming(0.96, { duration: duration + 300 })), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: scale.value }] }));

  return <Animated.View style={[styles.orb, { backgroundColor: color, width: size, height: size, top, left }, style]} />;
}

export default function AmbientBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={Colors.gradients.nightSky} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <LinearGradient colors={Colors.gradients.aurora} style={styles.overlay} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} />
      <Orb color="rgba(255,132,175,0.22)" size={250} top="10%" left="-15%" duration={5200} />
      <Orb color="rgba(167,139,250,0.2)" size={280} top="35%" left="62%" duration={6400} />
      <Orb color="rgba(112,194,255,0.15)" size={210} top="70%" left="20%" duration={5800} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, opacity: 0.55 },
  orb: { position: 'absolute', borderRadius: 999 },
});
