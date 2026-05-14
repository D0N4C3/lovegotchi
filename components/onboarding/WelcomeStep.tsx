import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Heart, Sparkles } from "lucide-react-native";
import Colors from "@/constants/colors";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo / Mascot */}
        <View style={styles.mascotContainer}>
          <Animated.View style={[styles.glowOrb, { opacity: glowAnim }]} />
          <View style={styles.mascot}>
            <View style={styles.mascotBody}>
              <View style={styles.mascotFace}>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                </View>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                </View>
              </View>
              <View style={styles.mouth} />
              <View style={styles.cheek} />
              <View style={[styles.cheek, styles.cheekRight]} />
            </View>
            <View style={styles.earLeft} />
            <View style={styles.earRight} />
          </View>
          <View style={styles.sparkleTopLeft}>
            <Sparkles size={16} color={Colors.accent} />
          </View>
          <View style={styles.sparkleTopRight}>
            <Sparkles size={12} color={Colors.primaryLight} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Lovegotchi</Text>
        <Text style={styles.tagline}>
          Raise a shared digital lifeform with your partner — together.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Heart size={16} color={Colors.primary} fill={Colors.primary} />
            </View>
            <Text style={styles.featureText}>Care together</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Sparkles size={16} color={Colors.accent} />
            </View>
            <Text style={styles.featureText}>Grow memories</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Heart size={16} color={Colors.secondary} fill={Colors.secondary} />
            </View>
            <Text style={styles.featureText}>Stay connected</Text>
          </View>
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Pressable onPress={onNext} style={styles.button}>
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </Pressable>
        <Text style={styles.hint}>It only takes a moment to get started</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  mascotContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  glowOrb: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryGlow,
  },
  mascot: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotBody: {
    width: 100,
    height: 90,
    borderRadius: 50,
    backgroundColor: Colors.petPink,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.petCoral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  mascotFace: {
    flexDirection: "row",
    gap: 16,
    marginTop: -8,
  },
  eye: {
    width: 20,
    height: 24,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pupil: {
    width: 10,
    height: 12,
    backgroundColor: Colors.textDark,
    borderRadius: 6,
  },
  mouth: {
    width: 18,
    height: 10,
    borderBottomWidth: 3,
    borderBottomColor: Colors.textDark,
    borderRadius: 10,
    marginTop: 6,
  },
  cheek: {
    position: "absolute",
    left: 12,
    top: 48,
    width: 18,
    height: 10,
    backgroundColor: Colors.petBlush,
    borderRadius: 9,
    opacity: 0.6,
  },
  cheekRight: {
    left: undefined,
    right: 12,
  },
  earLeft: {
    position: "absolute",
    top: -16,
    left: 14,
    width: 28,
    height: 36,
    borderRadius: 14,
    backgroundColor: Colors.petPink,
    transform: [{ rotate: "-12deg" }],
  },
  earRight: {
    position: "absolute",
    top: -16,
    right: 14,
    width: 28,
    height: 36,
    borderRadius: 14,
    backgroundColor: Colors.petPink,
    transform: [{ rotate: "12deg" }],
  },
  sparkleTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  sparkleTopRight: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: Colors.text,
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 24,
    marginBottom: 36,
  },
  features: {
    flexDirection: "row",
    gap: 16,
  },
  feature: {
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },
  hint: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 14,
  },
});
