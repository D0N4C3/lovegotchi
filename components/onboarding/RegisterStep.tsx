import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated, Pressable } from "react-native";
import { User, Sparkles, Copy, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import { generateUsername } from "@/store/authStore";

interface RegisterStepProps {
  onNext: (displayName: string, username: string) => void;
}

export default function RegisterStep({ onNext }: RegisterStepProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleNameChange = (text: string) => {
    setDisplayName(text);
    setError("");
    if (text.trim().length >= 2) {
      const generated = generateUsername(text.trim());
      setUsername(generated);
    } else {
      setUsername("");
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNext = () => {
    if (displayName.trim().length < 2) {
      setError("Please enter a name with at least 2 characters");
      return;
    }
    onNext(displayName.trim(), username);
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
          <User size={24} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>
          Let us know what to call you. We will create a unique username for you to share with your partner.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="e.g. Jamie"
          placeholderTextColor={Colors.textLight}
          value={displayName}
          onChangeText={handleNameChange}
          autoCapitalize="words"
          autoFocus
          maxLength={20}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {username.length > 0 && (
          <Animated.View style={styles.usernameCard}>
            <View style={styles.usernameHeader}>
              <Sparkles size={14} color={Colors.accent} />
              <Text style={styles.usernameLabel}>Your username</Text>
            </View>
            <View style={styles.usernameRow}>
              <Text style={styles.usernameText}>@{username}</Text>
              <Pressable onPress={handleCopy} style={styles.copyButton}>
                {copied ? (
                  <Check size={16} color={Colors.success} />
                ) : (
                  <Copy size={16} color={Colors.textMuted} />
                )}
              </Pressable>
            </View>
            <Text style={styles.usernameHint}>
              Share this with your partner so they can find you
            </Text>
          </Animated.View>
        )}
      </View>

      <Pressable
        onPress={handleNext}
        style={[styles.button, displayName.trim().length < 2 && styles.buttonDisabled]}
        disabled={displayName.trim().length < 2}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,139,123,0.12)",
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
  form: {
    flex: 1,
    justifyContent: "center",
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
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 13,
    color: Colors.danger,
    marginTop: 8,
    marginLeft: 4,
  },
  usernameCard: {
    marginTop: 24,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,140,100,0.15)",
  },
  usernameHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  usernameLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accent,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
    letterSpacing: -0.5,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  usernameHint: {
    fontSize: 13,
    color: Colors.textLight,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: Colors.primary,
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
});
