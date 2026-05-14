import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Flame,
  Calendar,
  Heart,
  Trophy,
  TrendingUp,
  Clock,
  Sparkles,
  Target,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { usePetStore } from "@/store/petStore";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  colorLight: string;
}

function StatCard({ icon, label, value, color, colorLight }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[`${color}20`, `${color}08`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCardGradient}
      />
      <View style={[styles.statIconBg, { backgroundColor: `${color}25` }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface MilestoneProps {
  title: string;
  date: string;
  completed: boolean;
}

function Milestone({ title, date, completed }: MilestoneProps) {
  return (
    <View style={styles.milestoneWrapper}>
      <View style={[styles.milestoneConnector, completed && styles.milestoneConnectorCompleted]} />
      <View style={[styles.milestoneDot, completed && styles.milestoneDotCompleted]}>
        {completed && <Sparkles size={10} color={Colors.background} />}
      </View>
      <View style={styles.milestoneContent}>
        <Text style={[styles.milestoneTitle, completed && styles.milestoneTitleCompleted]}>
          {title}
        </Text>
        <Text style={styles.milestoneDate}>{date}</Text>
      </View>
    </View>
  );
}

export default function CoupleScreen() {
  const { name, streak, longestStreak, level, xp, stage, careActionsToday } = usePetStore();

  const progress = Math.min(100, (careActionsToday.length / 6) * 100);

  const milestones: MilestoneProps[] = [
    { title: "First Day Together", date: "Jan 14, 2026", completed: true },
    { title: "7 Day Streak", date: "Jan 21, 2026", completed: true },
    { title: "30 Day Streak", date: "Feb 13, 2026", completed: true },
    { title: "100 Day Streak", date: "Apr 24, 2026", completed: true },
    { title: "6 Month Anniversary", date: "Jul 14, 2026", completed: false },
    { title: "1 Year Anniversary", date: "Jan 14, 2027", completed: false },
  ];

  const stages = ["egg", "baby", "child", "teen", "adult", "legendary"];
  const currentStageIndex = stages.indexOf(stage);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Our Journey</Text>
          <Text style={styles.subtitle}>Growing together with {name}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Flame size={20} color={Colors.primary} />}
            label="Streak"
            value={`${streak}`}
            color={Colors.primary}
            colorLight={Colors.primaryLight}
          />
          <StatCard
            icon={<Trophy size={20} color={Colors.accent} />}
            label="Best"
            value={`${longestStreak}`}
            color={Colors.accent}
            colorLight={Colors.accentLight}
          />
          <StatCard
            icon={<Heart size={20} color={Colors.petCoral} />}
            label="Level"
            value={`${level}`}
            color={Colors.petCoral}
            colorLight={Colors.petPink}
          />
          <StatCard
            icon={<TrendingUp size={20} color={Colors.secondary} />}
            label="XP"
            value={`${xp}`}
            color={Colors.secondary}
            colorLight={Colors.secondaryLight}
          />
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressGradient}
          />
          <View style={styles.progressHeader}>
            <View style={styles.progressLabelRow}>
              <View style={[styles.progressIcon, { backgroundColor: "rgba(245,193,86,0.15)" }]}>
                <Target size={16} color={Colors.accent} />
              </View>
              <Text style={styles.progressTitle}>Today's Progress</Text>
            </View>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]}>
              <LinearGradient
                colors={[Colors.accentLight, Colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressBarGradient}
              />
            </View>
          </View>
          <Text style={styles.progressSubtext}>
            {careActionsToday.length}/6 care actions completed today
          </Text>
        </View>

        {/* Pet Evolution */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "rgba(143,188,143,0.15)" }]}>
              <Sparkles size={16} color={Colors.secondary} />
            </View>
            <Text style={styles.sectionTitle}>Evolution</Text>
          </View>
          <View style={styles.evolutionCard}>
            <LinearGradient
              colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.evolutionGradient}
            />
            <View style={styles.evolutionRow}>
              {stages.map((s, i) => {
                const isCurrent = s === stage;
                const isPast = currentStageIndex > i;
                return (
                  <View key={s} style={styles.evolutionStep}>
                    <View
                      style={[
                        styles.evolutionDot,
                        isCurrent && styles.evolutionDotCurrent,
                        isPast && styles.evolutionDotPast,
                      ]}
                    >
                      {isCurrent && <View style={styles.evolutionDotInner} />}
                    </View>
                    {i < stages.length - 1 && (
                      <View
                        style={[
                          styles.evolutionLine,
                          (isCurrent || isPast) && styles.evolutionLineActive,
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
            <Text style={styles.evolutionText}>
              {name} is currently a <Text style={styles.evolutionHighlight}>{stage}</Text>
            </Text>
            <Text style={styles.evolutionSubtext}>
              {100 - (xp % 100)} XP until next level
            </Text>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "rgba(155,130,200,0.15)" }]}>
              <Trophy size={16} color="#B39DDB" />
            </View>
            <Text style={styles.sectionTitle}>Milestones</Text>
          </View>
          <View style={styles.milestonesCard}>
            {milestones.map((milestone, index) => (
              <Milestone key={index} {...milestone} />
            ))}
          </View>
        </View>

        {/* Next Anniversary */}
        <View style={styles.anniversaryCard}>
          <LinearGradient
            colors={["rgba(255,139,123,0.10)", "rgba(255,139,123,0.03)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.anniversaryGradient}
          />
          <View style={[styles.anniversaryIcon, { backgroundColor: "rgba(255,139,123,0.15)" }]}>
            <Calendar size={20} color={Colors.primary} />
          </View>
          <View style={styles.anniversaryContent}>
            <Text style={styles.anniversaryLabel}>Next Anniversary</Text>
            <Text style={styles.anniversaryValue}>6 Month Anniversary</Text>
            <Text style={styles.anniversaryDate}>In 62 days</Text>
          </View>
          <Clock size={20} color={Colors.textLight} />
        </View>

        <View style={styles.bottomSpacer} />
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
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    width: "47%",
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  progressCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.accent,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarGradient: {
    flex: 1,
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
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
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  evolutionCard: {
    borderRadius: 24,
    padding: 18,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  evolutionGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  evolutionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  evolutionStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  evolutionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  evolutionDotCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  evolutionDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.text,
  },
  evolutionDotPast: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  evolutionLine: {
    width: 22,
    height: 3,
    backgroundColor: Colors.border,
  },
  evolutionLineActive: {
    backgroundColor: Colors.secondary,
  },
  evolutionText: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
  },
  evolutionHighlight: {
    fontWeight: "800",
    color: Colors.primary,
  },
  evolutionSubtext: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 4,
  },
  milestonesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    position: "relative",
    paddingLeft: 24,
  },
  milestoneConnector: {
    position: "absolute",
    left: 6,
    top: 22,
    width: 2,
    height: "100%",
    backgroundColor: Colors.border,
  },
  milestoneConnectorCompleted: {
    backgroundColor: Colors.secondary,
  },
  milestoneDot: {
    position: "absolute",
    left: 0,
    top: 14,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  milestoneDotCompleted: {
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textLight,
    marginBottom: 2,
  },
  milestoneTitleCompleted: {
    color: Colors.text,
  },
  milestoneDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  anniversaryCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,139,123,0.2)",
  },
  anniversaryGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  anniversaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  anniversaryContent: {
    flex: 1,
  },
  anniversaryLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
    marginBottom: 2,
  },
  anniversaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  anniversaryDate: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 30,
  },
});
