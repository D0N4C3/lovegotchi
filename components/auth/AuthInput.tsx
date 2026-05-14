import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import Colors from "@/constants/colors";

interface Props extends TextInputProps {
  label: string;
  error?: string;
  rightAction?: React.ReactNode;
}

export function AuthInput({ label, error, rightAction, ...props }: Props) {
  return (
    <View style={s.group}>
      <Text style={s.label}>{label.toUpperCase()}</Text>
      <View style={[s.inputRow, error ? s.inputRowError : null]}>
        <TextInput
          style={[s.input, s.inputFlex]}
          placeholderTextColor={Colors.textHint}
          selectionColor={Colors.primary}
          {...props}
        />
        {rightAction && <View style={s.rightAction}>{rightAction}</View>}
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
    color: Colors.textMuted,
    textTransform: "uppercase",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  inputRowError: {
    borderColor: Colors.danger,
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: "transparent",
  },
  rightAction: {
    paddingRight: 14,
  },
  error: {
    fontSize: 11,
    color: Colors.danger,
  },
});