import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, { FadeInDown } from "react-native-reanimated";
import Colors from "@/constants/colors";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient colors={["#140F1F", "#341935", "#5A2149"]} style={styles.gradient}>
      <View style={[styles.blob, styles.blobOne]} />
      <View style={[styles.blob, styles.blobTwo]} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Animated.View entering={FadeInDown.duration(550)}>
              <BlurView intensity={35} tint="light" style={styles.card}>{children}</BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: { borderRadius: 28, padding: 22, overflow: "hidden", borderWidth: 1, borderColor: Colors.border, gap: 14 },
  blob: { position: "absolute", width: 240, height: 240, borderRadius: 999, backgroundColor: Colors.primaryGlow },
  blobOne: { top: -40, left: -70 },
  blobTwo: { bottom: -50, right: -60, backgroundColor: Colors.secondaryGlow },
});
