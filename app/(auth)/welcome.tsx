import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Colors from "@/constants/colors";

const TAGS = ["🏡 shared home", "💞 couple streaks", "🌱 evolve together"];

export default function Welcome() {
  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.delay(60).springify()} style={styles.hero}>
        <Text style={styles.petEmoji}>🐾</Text>

        <View style={styles.starRow}>
          {["#AFA9EC", "#ED93B1", "#5DCAA5", "#AFA9EC", "#ED93B1"].map((c, i) => (
            <View key={i} style={[styles.star, { backgroundColor: c }]} />
          ))}
        </View>

        <Text style={styles.title}>Grow love, one tiny{"\n"}moment at a time.</Text>
        <Text style={styles.subtitle}>
          A cozy home for two hearts and one adorable digital companion.
        </Text>

        <View style={styles.tagRow}>
          {TAGS.map((t) => (
            <View key={t} style={styles.tag}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.actions}>
        <Link href="/(auth)/login" asChild>
          <PrimaryButton label="Continue →" onPress={() => {}} />
        </Link>
        <Link href="/(auth)/signup" asChild>
          <PrimaryButton label="Create account" variant="ghost" onPress={() => {}} />
        </Link>
        <Text style={styles.legal}>By continuing you agree to our Terms & Privacy</Text>
      </Animated.View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 32,
  },
  petEmoji: {
    fontSize: 72,
    textAlign: "center",
  },
  starRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  star: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    lineHeight: 34,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 260,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
    marginTop: 4,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  actions: {
    gap: 10,
  },
  legal: {
    fontSize: 11,
    color: Colors.textHint,
    textAlign: "center",
    marginTop: 2,
  },
});