import React from "react";
import { ScrollView, Text, View, StyleSheet, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  ChevronRight,
  Crown,
  Settings,
  LogOut,
  Heart,
  Flame,
  Copy,
  Check,
} from "lucide-react-native";
import Colors from "@/constants/colors";
import { usePetStore } from "@/store/petStore";
import { useAuthStore } from "@/store/authStore";
import AchievementBadge from "@/components/AchievementBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/providers/ToastProvider";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
}

function SettingRow({ icon, label, value, hasToggle, toggleValue, onToggle, onPress }: SettingRowProps) {
  return (
    <Pressable onPress={onPress} disabled={hasToggle} style={styles.settingRow}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingLabel}>{label}</Text>
      {hasToggle && onToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={toggleValue ? Colors.text : Colors.textLight}
        />
      ) : (
        <View style={styles.settingRight}>
          {value && <Text style={styles.settingValue}>{value}</Text>}
          <ChevronRight size={18} color={Colors.textLight} />
        </View>
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const { name, achievements, streak, memories } = usePetStore();
  const { user, partner, logout } = useAuthStore();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const { show } = useToast();

  const handleCopyUsername = () => {
    if (!user) return;
    setCopied(true);
    show("Username copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => setShowLogoutDialog(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          />
          <View style={styles.avatar}>
            <User size={32} color={Colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName ?? "You"}</Text>
            <Pressable onPress={handleCopyUsername} style={styles.usernameRow}>
              <Text style={styles.userUsername}>@{user?.username ?? "guest"}</Text>
              {copied ? (
                <Check size={12} color={Colors.success} />
              ) : (
                <Copy size={12} color={Colors.textLight} />
              )}
            </Pressable>
          </View>
          <View style={styles.premiumBadge}>
            <Crown size={14} color={Colors.accent} />
            <Text style={styles.premiumText}>Free</Text>
          </View>
        </View>

        {/* Partner Info */}
        {partner && (
          <View style={styles.partnerCard}>
            <LinearGradient
              colors={["rgba(143,188,143,0.06)", "rgba(143,188,143,0.02)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            />
            <View style={styles.partnerIcon}>
              <Heart size={16} color={Colors.secondary} fill={Colors.secondary} />
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerLabel}>Partner</Text>
              <Text style={styles.partnerName}>{partner.displayName}</Text>
              <Text style={styles.partnerUsername}>@{partner.username}</Text>
            </View>
            <View style={[styles.statusBadge, partner.status === "accepted" ? styles.statusAccepted : styles.statusPending]}>
              <Text style={styles.statusText}>
                {partner.status === "accepted" ? "Connected" : "Pending"}
              </Text>
            </View>
          </View>
        )}

        {/* Pet Info */}
        <View style={styles.petCard}>
          <LinearGradient
            colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.01)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          />
          <View style={styles.petInfoRow}>
            <View style={styles.petInfoLeft}>
              <Heart size={16} color={Colors.primary} />
              <Text style={styles.petLabel}>Your Pet</Text>
            </View>
            <Text style={styles.petName}>{name}</Text>
          </View>
          <View style={styles.petInfoRow}>
            <View style={styles.petInfoLeft}>
              <Flame size={16} color={Colors.accent} />
              <Text style={styles.petLabel}>Current Streak</Text>
            </View>
            <Text style={styles.petValue}>{streak} days</Text>
          </View>
          <View style={styles.petInfoRow}>
            <View style={styles.petInfoLeft}>
              <Crown size={16} color={Colors.secondary} />
              <Text style={styles.petLabel}>Memories</Text>
            </View>
            <Text style={styles.petValue}>{memories.length} shared</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "rgba(245,193,86,0.15)" }]}>
              <Crown size={16} color={Colors.accent} />
            </View>
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} title={achievement} index={index} />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: "rgba(100,180,200,0.15)" }]}>
              <Settings size={16} color="#80DEEA" />
            </View>
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>
          <View style={styles.settingsCard}>
            <SettingRow
              icon={<Bell size={18} color={Colors.textMuted} />}
              label="Notifications"
              hasToggle
              toggleValue={notifications}
              onToggle={setNotifications}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Moon size={18} color={Colors.textMuted} />}
              label="Dark Mode"
              hasToggle
              toggleValue={darkMode}
              onToggle={setDarkMode}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Settings size={18} color={Colors.textMuted} />}
              label="App Settings"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<Shield size={18} color={Colors.textMuted} />}
              label="Privacy"
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <SettingRow
              icon={<HelpCircle size={18} color={Colors.textMuted} />}
              label="Help & Support"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <View style={styles.bottomSpacer} />
        <ConfirmDialog
          visible={showLogoutDialog}
          title="Sign Out"
          message="Are you sure you want to sign out? Your pet and memories will be saved."
          confirmLabel="Sign Out"
          onCancel={() => setShowLogoutDialog(false)}
          onConfirm={() => { setShowLogoutDialog(false); logout(); }}
        />
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
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  userCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,139,123,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userUsername: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  premiumBadge: {
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
  premiumText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.accent,
  },
  partnerCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(143,188,143,0.2)",
  },
  partnerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(143,188,143,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  partnerInfo: {
    flex: 1,
  },
  partnerLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "600",
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 1,
  },
  partnerUsername: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusAccepted: {
    backgroundColor: "rgba(123,198,123,0.15)",
  },
  statusPending: {
    backgroundColor: "rgba(245,193,86,0.15)",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.text,
  },
  petCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  petInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  petInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  petLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  petName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  petValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
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
  achievementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  settingIcon: {
    marginRight: 14,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 50,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.danger,
  },
  bottomSpacer: {
    height: 30,
  },
});
