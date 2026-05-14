import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Heart, Mic, Image as ImageIcon, MessageCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { Memory } from "@/store/petStore";

interface MemoryCardProps {
  memory: Memory;
}

const typeConfig = (type: Memory["type"]) => {
  switch (type) {
    case "photo":
      return {
        icon: <ImageIcon size={14} color={Colors.primaryLight} />,
        label: "Photo Memory",
        gradient: ["rgba(255,139,123,0.15)", "rgba(255,139,123,0.05)"] as [string, string],
        borderColor: "rgba(255,139,123,0.2)",
      };
    case "voice":
      return {
        icon: <Mic size={14} color={Colors.secondaryLight} />,
        label: "Voice Note",
        gradient: ["rgba(143,188,143,0.15)", "rgba(143,188,143,0.05)"] as [string, string],
        borderColor: "rgba(143,188,143,0.2)",
      };
    case "text":
      return {
        icon: <MessageCircle size={14} color={Colors.accentLight} />,
        label: "Text Memory",
        gradient: ["rgba(245,193,86,0.15)", "rgba(245,193,86,0.05)"] as [string, string],
        borderColor: "rgba(245,193,86,0.2)",
      };
  }
};

export default function MemoryCard({ memory }: MemoryCardProps) {
  const dateObj = new Date(memory.date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const config = typeConfig(memory.type);

  return (
    <View style={[styles.container, { borderColor: config.borderColor }]}>
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: config.borderColor }]}>
            {config.icon}
            <Text style={styles.typeText}>{config.label}</Text>
          </View>
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <Text style={styles.title}>{memory.title}</Text>
        <Text style={styles.bodyText} numberOfLines={3}>
          {memory.content}
        </Text>

        <View style={styles.footer}>
          <Heart size={12} color={Colors.primary} fill={Colors.primary} />
          <Text style={styles.partner}>With {memory.partnerName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 16,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  partner: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
});
