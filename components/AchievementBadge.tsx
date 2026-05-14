import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Award } from "lucide-react-native";
import Colors from "@/constants/colors";

interface AchievementBadgeProps {
  title: string;
  index: number;
}

const badgeColors = [
  { bg: "rgba(255,139,123,0.15)", icon: Colors.primary, border: "rgba(255,139,123,0.25)" },
  { bg: "rgba(143,188,143,0.15)", icon: Colors.secondary, border: "rgba(143,188,143,0.25)" },
  { bg: "rgba(245,193,86,0.15)", icon: Colors.accent, border: "rgba(245,193,86,0.25)" },
  { bg: "rgba(155,130,200,0.15)", icon: "#B39DDB", border: "rgba(155,130,200,0.25)" },
  { bg: "rgba(100,180,200,0.15)", icon: "#80DEEA", border: "rgba(100,180,200,0.25)" },
];

export default function AchievementBadge({ title, index }: AchievementBadgeProps) {
  const colors = badgeColors[index % badgeColors.length];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Award size={16} color={colors.icon} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text,
  },
});
