import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated, Pressable } from "react-native";
import { Users, Search, Heart, Clock, ArrowRight } from "lucide-react-native";
import Colors from "@/constants/colors";

interface PartnerStepProps {
  myUsername: string;
  onNext: (partnerUsername: string) => void;
  onSkip: () => void;
}

export default function PartnerStep({ myUsername, onNext, onSkip }: PartnerStepProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [partnerUsername, setPartnerUsername] = useState("");
  const [mode, setMode] = useState<"search" | "share">("search");
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSearch = () => {
    const trimmed = partnerUsername.trim().replace("@", "");
    if (trimmed.length < 3) {
      setError("Please enter a valid username");
      return;
    }
    if (trimmed === myUsername) {
      setError("That is your own username!");
      return;
    }
    setError("");
    onNext(trimmed);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Users size={24} color={Colors.secondary} />
        </View>
        <Text style={styles.title}>Find your partner</Text>
        <Text style={styles.subtitle}>
          Connect with your special someone to raise your Lovegotchi together.
        </Text>
      </View>

      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <Pressable
          onPress={() => setMode("search")}
          style={[styles.modeButton, mode === "search" && styles.modeButtonActive]}
        >
          <Search size={14} color={mode === "search" ? Colors.text : Colors.textMuted} />
          <Text style={[styles.modeText, mode === "search" && styles.modeTextActive]}>
            Find Partner
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode("share")}
          style={[styles.modeButton, mode === "share" && styles.modeButtonActive]}
        >
          <Heart size={14} color={mode === "share" ? Colors.text : Colors.textMuted} />
          <Text style={[styles.modeText, mode === "share" && styles.modeTextActive]}>
            Share Code
          </Text>
        </Pressable>
      </View>

      {mode === "search" ? (
        <View style={styles.form}>
          <Text style={styles.label}>Partner username</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="@partner_username"
            placeholderTextColor={Colors.textLight}
            value={partnerUsername}
            onChangeText={(text) => {
              setPartnerUsername(text);
              setError("");
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            onPress={handleSearch}
            style={[styles.button, partnerUsername.trim().length < 3 && styles.buttonDisabled]}
            disabled={partnerUsername.trim().length < 3}
          >
            <Text style={styles.buttonText}>Send Invitation</Text>
            <ArrowRight size={18} color={Colors.text} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.shareCard}>
          <View style={styles.shareHeader}>
            <Heart size={18} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.shareTitle}>Share your username</Text>
          </View>
          <Text style={styles.shareBody}>
            Tell your partner to search for you using this username:
          </Text>
          <View style={styles.shareCodeBox}>
            <Text style={styles.shareCode}>@{myUsername}</Text>
          </View>
          <View style={styles.shareStatus}>
            <Clock size={14} color={Colors.textLight} />
            <Text style={styles.shareStatusText}>
              Waiting for your partner to connect...
            </Text>
          </View>
        </View>
      )}

      <Pressable onPress={onSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>I will invite them later</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(143,188,143,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modeToggle: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  modeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textLight,
  },
  modeTextActive: {
    color: Colors.text,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: 10,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 13,
    color: Colors.danger,
    marginBottom: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.text,
  },
  shareCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  shareHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.text,
  },
  shareBody: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 18,
  },
  shareCodeBox: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 18,
  },
  shareCode: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  shareStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  shareStatusText: {
    fontSize: 13,
    color: Colors.textLight,
  },
  skipButton: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textLight,
  },
});
