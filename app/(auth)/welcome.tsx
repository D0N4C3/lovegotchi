import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AuthShell } from "@/components/auth/AuthShell";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import Colors from "@/constants/colors";

export default function Welcome() {
  return (
    <AuthShell>
      <Animated.View entering={FadeInDown.delay(80)} style={styles.hero}>
        <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.badge}><Text style={styles.badgeText}>Lovegotchi</Text></LinearGradient>
        <Text style={styles.title}>Grow love, one tiny moment at a time.</Text>
        <Text style={styles.subtitle}>A cozy home for two hearts and one adorable digital companion.</Text>
      </Animated.View>
      <Link href="/(auth)/login" asChild><PrimaryButton label="Continue" onPress={() => {}} /></Link>
      <Link href="/(auth)/signup" asChild><PrimaryButton style={styles.alt} label="Create account" onPress={() => {}} /></Link>
    </AuthShell>
  );
}
const styles = StyleSheet.create({
  hero: { gap: 10, marginBottom: 10 },
  badge: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  badgeText: { color: "white", fontWeight: "700" },
  title: { color: Colors.text, fontWeight: "800", fontSize: 28 },
  subtitle: { color: Colors.textMuted, fontSize: 15, lineHeight: 22 },
  alt: { backgroundColor: "rgba(255,255,255,0.2)" },
});
