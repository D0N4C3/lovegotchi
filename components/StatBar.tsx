import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  colorLight: string;
  icon: React.ReactNode;
}

export default function StatBar({ label, value, color, colorLight, icon }: StatBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const isLow = clampedValue < 30;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={[styles.iconWrapper, { backgroundColor: `${color}18` }]}>
          {icon}
        </View>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueBadge}>
          <Text style={[styles.value, { color: isLow ? Colors.danger : color }]}>
            {clampedValue}%
          </Text>
        </View>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${clampedValue}%` }]}>
          <LinearGradient
            colors={[colorLight, color]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </View>
        {isLow && (
          <View style={[styles.pulseDot, { backgroundColor: color }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    flex: 1,
  },
  valueBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  value: {
    fontSize: 12,
    fontWeight: "800",
  },
  barBackground: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    borderRadius: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: -8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
