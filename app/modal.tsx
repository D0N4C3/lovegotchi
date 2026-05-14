import React from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

export default function ModalScreen() {
  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={() => router.back()}
    >
      <StatusBar style="light" />

      <Pressable style={styles.overlay} onPress={() => router.back()}>
        {/* Backdrop blur tint */}
        <View style={styles.backdrop} />

        {/* Sheet — stop tap propagation */}
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Close button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
          >
            <X size={18} color={Colors.textMuted} />
          </Pressable>

          {/* Content */}
          <View style={styles.body}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Modal</Text>
            <Text style={styles.description}>
              This is an example modal. Edit it in{" "}
              <Text style={styles.code}>app/modal.tsx</Text>.
            </Text>
          </View>

          {/* CTA */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.ctaWrap, pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cta}
            >
              <Text style={styles.ctaText}>Got it</Text>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,5,20,0.72)",
  },
  sheet: {
    width: "100%",
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.93 }],
  },
  body: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 10,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  code: {
    color: Colors.primaryLight,
    fontWeight: "600",
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cta: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 16,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});