import React, { useEffect, useRef } from "react";
import { ScrollView, Text, View, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Flame, Zap, Heart, Cookie, Gamepad2, Moon, Droplets, MessageCircle, Smile, Sparkles } from "lucide-react-native";
import Colors from "@/constants/colors";
import { usePetStore } from "@/store/petStore";
import PetAvatar from "@/components/PetAvatar";
import StatBar from "@/components/StatBar";
import CareActionButton from "@/components/CareActionButton";
import RoomScene from "@/components/RoomScene";

const moodMessage = (mood: string, name: string) => {
  switch (mood) {
    case "happy":
      return `${name} is feeling wonderful today!`;
    case "sleepy":
      return `${name} is getting sleepy...`;
    case "hungry":
      return `${name}'s tummy is rumbling!`;
    case "playful":
      return `${name} wants to play!`;
    case "lonely":
      return `${name} misses you both...`;
    case "excited":
      return `${name} is so excited to see you!`;
    default:
      return `${name} is happy to see you!`;
  }
};

const stageEmoji = (stage: string) => {
  switch (stage) {
    case "egg": return "\uD83E\uDD5A";
    case "baby": return "\uD83D\uDC76";
    case "child": return "\uD83E\uDDD2";
    case "teen": return "\uD83E\uDDD1";
    case "adult": return "\u2728";
    case "legendary": return "\uD83D\uDC51";
    default: return "\u2728";
  }
};

function GlowBadge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <View style={[styles.glowBadge, { shadowColor: color }]}>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const pet = usePetStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    pet.checkDailyReset();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const careActions = [
    { label: "Feed", icon: <Cookie size={22} color={Colors.textDark} />, color: "#FF8C7A", colorLight: "#FFB5A7", action: pet.feed },
    { label: "Play", icon: <Gamepad2 size={22} color={Colors.textDark} />, color: "#F5C156", colorLight: "#FDE8A0", action: pet.play },
    { label: "Cuddle", icon: <Heart size={22} color={Colors.textDark} />, color: "#FF6B6B", colorLight: "#FFB5B5", action: pet.cuddle },
    { label: "Sleep", icon: <Moon size={22} color={Colors.textDark} />, color: "#9FA8DA", colorLight: "#C5CAE9", action: pet.sleep },
    { label: "Bathe", icon: <Droplets size={22} color={Colors.textDark} />, color: "#80DEEA", colorLight: "#B2EBF2", action: pet.bathe },
    { label: "Talk", icon: <MessageCircle size={22} color={Colors.textDark} />, color: "#A8C5A8", colorLight: "#C8E0C8", action: pet.talk },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good Evening</Text>
              <Text style={styles.subtitle}>Take care of {pet.name} together</Text>
            </View>
            <GlowBadge color={Colors.primary}>
              <Flame size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.streakText}>{pet.streak} days</Text>
            </GlowBadge>
          </View>

          {/* Room Scene with Pet */}
          <RoomScene>
            <View style={styles.petInRoom}>
              <PetAvatar />
            </View>
          </RoomScene>

          {/* Pet Info Card */}
          <View style={styles.infoCard}>
            <LinearGradient
              colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.infoCardGradient}
            />
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <View style={styles.nameRow}>
                  <Text style={styles.petName}>
                    {pet.name} {stageEmoji(pet.stage)}
                  </Text>
                  <View style={styles.levelBadge}>
                    <Zap size={12} color={Colors.accent} fill={Colors.accent} />
                    <Text style={styles.levelText}>Lv.{pet.level}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.moodRow}>
                <View style={styles.moodIcon}>
                  <Smile size={14} color={Colors.textMuted} />
                </View>
                <Text style={styles.moodText}>{moodMessage(pet.mood, pet.name)}</Text>
                <View style={styles.xpBadge}>
                  <Sparkles size={12} color={Colors.accent} />
                  <Text style={styles.xpText}>{pet.xp} XP</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrapper}>
                <Heart size={14} color={Colors.primary} fill={Colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>How {pet.name} is feeling</Text>
            </View>
            <View style={styles.statsCard}>
              <StatBar
                label="Hunger"
                value={pet.hunger}
                color="#FF8C7A"
                colorLight="#FFB5A7"
                icon={<Cookie size={14} color="#FF8C7A" />}
              />
              <StatBar
                label="Energy"
                value={pet.energy}
                color="#9FA8DA"
                colorLight="#C5CAE9"
                icon={<Zap size={14} color="#9FA8DA" />}
              />
              <StatBar
                label="Love"
                value={pet.love}
                color="#FF6B6B"
                colorLight="#FFB5B5"
                icon={<Heart size={14} color="#FF6B6B" fill="#FF6B6B" />}
              />
              <StatBar
                label="Happiness"
                value={pet.happiness}
                color="#F5C156"
                colorLight="#FDE8A0"
                icon={<Smile size={14} color="#F5C156" />}
              />
            </View>
          </View>

          {/* Care Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIconWrapper, { backgroundColor: "rgba(245,193,86,0.15)" }]}>
                <Sparkles size={14} color={Colors.accent} />
              </View>
              <Text style={styles.sectionTitle}>Daily Care</Text>
              <Text style={styles.sectionSubtitle}>
                {pet.careActionsToday.length}/6 done
              </Text>
            </View>
            <View style={styles.actionsGrid}>
              {careActions.map((action) => (
                <CareActionButton
                  key={action.label}
                  label={action.label}
                  icon={action.icon}
                  color={action.color}
                  colorLight={action.colorLight}
                  onPress={action.action}
                  doneToday={pet.careActionsToday.includes(action.label.toLowerCase())}
                />
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  glowBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  streakText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
  },
  petInRoom: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  infoCard: {
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoContent: {
    padding: 18,
    position: "relative",
  },
  infoRow: {
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  petName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245,193,86,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(245,193,86,0.2)",
  },
  levelText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.accent,
  },
  moodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moodIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  moodText: {
    fontSize: 14,
    color: Colors.textMuted,
    flex: 1,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,139,123,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  bottomSpacer: {
    height: 30,
  },
});
