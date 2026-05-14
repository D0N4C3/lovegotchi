import React from "react";
import { Pressable, Text, StyleSheet, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

interface CareActionButtonProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  colorLight: string;
  onPress: () => void;
  disabled?: boolean;
  doneToday?: boolean;
}

export default function CareActionButton({
  label,
  icon,
  color,
  colorLight,
  onPress,
  disabled,
  doneToday,
}: CareActionButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (disabled || doneToday) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled || doneToday}>
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          doneToday && styles.done,
        ]}
      >
        {/* Glow ring */}
        {!doneToday && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                borderColor: color,
                opacity: glowAnim,
              },
            ]}
          />
        )}
        <LinearGradient
          colors={doneToday ? ["rgba(255,255,255,0.04)", "rgba(255,255,255,0.02)"] : [colorLight, color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={[styles.iconWrapper, doneToday && styles.iconDone]}>
            {icon}
          </View>
          <Text style={[styles.label, doneToday && styles.labelDone]}>
            {doneToday ? "Done!" : label}
          </Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glowRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 23,
    borderWidth: 2,
    opacity: 0,
  },
  gradient: {
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 88,
    borderRadius: 20,
  },
  iconWrapper: {
    marginBottom: 8,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconDone: {
    opacity: 0.3,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textDark,
  },
  labelDone: {
    color: Colors.textLight,
  },
  done: {
    opacity: 0.5,
  },
});
