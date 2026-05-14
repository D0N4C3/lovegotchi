import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import Colors from "@/constants/colors";

export default function Signup() {
  const { signup, loginGoogle, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");
      await signup(email.trim(), password);
    } catch (ex: any) {
      setError(ex?.message ?? "Unable to sign up");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create account</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={Colors.textLight}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        placeholderTextColor={Colors.textLight}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={submit} disabled={authLoading}>
        <Text style={styles.buttonText}>Sign up</Text>
      </Pressable>
      <Pressable style={styles.googleButton} onPress={loginGoogle} disabled={authLoading}>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>
      <Link href="/(auth)/login" style={styles.link}>
        Already have an account? Log in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: Colors.background },
  heading: { fontSize: 28, color: Colors.text, fontWeight: "800", marginBottom: 16 },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: { backgroundColor: Colors.primary, padding: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: Colors.background, fontWeight: "700" },
  googleButton: { backgroundColor: Colors.surfaceWarm, padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },
  googleButtonText: { color: Colors.text },
  error: { color: Colors.danger, marginBottom: 8 },
  link: { color: Colors.textLight, textAlign: "center", marginTop: 16 },
});
