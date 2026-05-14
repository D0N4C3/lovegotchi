import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Colors from "@/constants/colors";

interface Props {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "ghost";
}

export function PrimaryButton({ label, onPress, disabled, style, variant = "primary" }: Props) {
  if (variant === "ghost") {
    return (
      <Pressable
        style={[s.ghost, disabled && s.disabled, style]}
        onPress={onPress} disabled={disabled}
      >
        <Text style={s.ghostLabel}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[s.wrapper, style]}>
      <LinearGradient
        colors={["#7F77DD", "#D4537E"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[s.gradient, disabled && s.disabled]}
      >
        <Text style={s.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const s = StyleSheet.create({
  wrapper: { borderRadius: 14 },
  gradient: { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  label: { color: "#fff", fontWeight: "700", fontSize: 15, letterSpacing: 0.2 },
  ghost: {
    borderRadius: 14, paddingVertical: 13,
    borderWidth: 0.5, borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center",
  },
  ghostLabel: { color: "rgba(240,238,248,0.8)", fontWeight: "600", fontSize: 14 },
  disabled: { opacity: 0.5 },
});