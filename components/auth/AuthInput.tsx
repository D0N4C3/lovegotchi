import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Colors from "@/constants/colors";

export function AuthInput({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={Colors.textLight} {...props} style={[styles.input, props.style]} />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: Colors.text, marginBottom: 8, fontWeight: "600" },
  input: { backgroundColor: "rgba(255,255,255,0.12)", color: Colors.text, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  error: { color: Colors.danger, marginTop: 6, fontSize: 12 },
});
