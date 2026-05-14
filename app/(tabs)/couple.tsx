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
  tint: string;
}

function StatCard({ icon, label, value, tint }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderColor: `${tint}40` }]}>
      <View style={[styles.statIconBg, { backgroundColor: `${tint}25` }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface MilestoneProps {
  title: string;
  date: string;
  completed: boolean;
  isLast: boolean;
}

function Milestone({ title, date, completed, isLast }: MilestoneProps) {
  return (
    <View style={styles.milestoneWrapper}>
      {!isLast && (
        <View style={[styles.milestoneConnector, completed && styles.milestoneConnectorCompleted]} />
      )}
      <View style={[styles.milestoneDot, completed && styles.milestoneDotCompleted]}>
        {completed && <Sparkles size={9} color={Colors.background} />}
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

const STAGES = ["egg", "baby", "child", "teen", "adult", "legendary"] as const;

export default function CoupleScreen() {
  const { name, streak, longestStreak, level, xp, stage, careActionsToday } = usePetStore();

  const progress = Math.min(100, (careActionsToday.length / 6) * 100);
  const currentStageIndex = STAGES.indexOf(stage as typeof STAGES[number]);

  const milestones: Omit<MilestoneProps, "isLast">[] = [
    { title: "First Day Together",  date: "Jan 14, 2026", completed: true },
    { title: "7-Day Streak",        date: "Jan 21, 2026", completed: true },
    { title: "30-Day Streak",       date: "Feb 13, 2026", completed: true },
    { title: "100-Day Streak",      date: "Apr 24, 2026", completed: true },
    { title: "6 Month Anniversary", date: "Jul 14, 2026", completed: false },
    { title: "1 Year Anniversary",  date: "Jan 14, 2027", completed: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            tint={Colors.primary}
          />
          <StatCard
            icon={<Trophy size={20} color={Colors.accent} />}
            label="Best"
            value={`${longestStreak}`}
            tint={Colors.accent}
          />
          <StatCard
            icon={<Heart size={20} color={Colors.secondaryLight} />}
            label="Level"
            value={`${level}`}
            tint={Colors.secondaryLight}
          />
          <StatCard
            icon={<TrendingUp size={20} color={Colors.tealLight} />}
            label="XP"
            value={`${xp}`}
            tint={Colors.tealLight}
          />
        </View>

        {/* Daily Progress */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <View style={styles.progressLabelRow}>
              <View style={[styles.iconBg, { backgroundColor: "rgba(175,169,236,0.15)" }]}>
                <Target size={16} color={Colors.primaryLight} />
              </View>
              <Text style={styles.cardTitle}>Today's Progress</Text>
            </View>
            <Text style={[styles.progressPercent, { color: Colors.primaryLight }]}>
              {Math.round(progress)}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]}>
              <LinearGradient
                colors={[Colors.primaryLight, Colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>
          </View>
          <Text style={styles.progressSub}>
            {careActionsToday.length} of 6 care actions completed
          </Text>
        </View>

        {/* Evolution */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: "rgba(93,202,165,0.15)" }]}>
              <Sparkles size={16} color={Colors.tealLight} />
            </View>
            <Text style={styles.sectionTitle}>Evolution</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.evolutionRow}>
              {STAGES.map((s, i) => {
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
                    {i < STAGES.length - 1 && (
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
              {name} is currently a{" "}
              <Text style={styles.evolutionHighlight}>{stage}</Text>
            </Text>
            <Text style={styles.evolutionSub}>{100 - (xp % 100)} XP until next level</Text>
          </View>
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBg, { backgroundColor: "rgba(155,130,200,0.15)" }]}>
              <Trophy size={16} color={Colors.primaryLight} />
            </View>
            <Text style={styles.sectionTitle}>Milestones</Text>
          </View>
          <View style={styles.card}>
            {milestones.map((milestone, index) => (
              <Milestone
                key={milestone.title}
                {...milestone}
                isLast={index === milestones.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Next Anniversary */}
        <View style={[styles.card, styles.anniversaryCard]}>
          <View style={[styles.iconBg, { backgroundColor: "rgba(212,83,126,0.15)" }]}>
            <Calendar size={20} color={Colors.secondary} />
          </View>
          <View style={styles.anniversaryContent}>
            <Text style={styles.anniversaryLabel}>Next Anniversary</Text>
            <Text style={styles.anniversaryValue}>6 Month Anniversary</Text>
            <Text style={[styles.anniversaryDate, { color: Colors.secondary }]}>In 62 days</Text>
          </View>
          <Clock size={18} color={Colors.textLight} />
        </View>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 8,
    marginBottom: 24,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },

  // Shared card shell
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Stats
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    width: "47%",
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
  },

  // Progress
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressSub: {
    fontSize: 13,
    color: Colors.textMuted,
  },

  // Sections
  section: {
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },

  // Evolution
  evolutionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  evolutionStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  evolutionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  evolutionDotCurrent: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  evolutionDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
  evolutionDotPast: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  evolutionLine: {
    width: 20,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  evolutionLineActive: {
    backgroundColor: Colors.secondary,
  },
  evolutionText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
  },
  evolutionHighlight: {
    fontWeight: "800",
    color: Colors.primary,
  },
  evolutionSub: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: "center",
  },

  // Milestones
  milestoneWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingLeft: 26,
    position: "relative",
  },
  milestoneConnector: {
    position: "absolute",
    left: 6,
    top: 20,
    width: 2,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  milestoneConnectorCompleted: {
    backgroundColor: Colors.secondary,
  },
  milestoneDot: {
    position: "absolute",
    left: 0,
    top: 12,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneDotCompleted: {
    backgroundColor: Colors.secondary,
  },
  milestoneContent: {
    flex: 1,
    gap: 2,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textLight,
  },
  milestoneTitleCompleted: {
    color: Colors.text,
  },
  milestoneDate: {
    fontSize: 12,
    color: Colors.textHint,
  },

  // Anniversary
  anniversaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
    borderColor: "rgba(212,83,126,0.25)",
  },
  anniversaryContent: {
    flex: 1,
    gap: 2,
  },
  anniversaryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  anniversaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  anniversaryDate: {
    fontSize: 13,
    fontWeight: "700",
  },
});