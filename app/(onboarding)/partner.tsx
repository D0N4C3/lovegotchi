import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Search, UserPlus, Check, X, Link2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/providers/AuthProvider";
import {
  searchUser,
  sendPartnerRequest,
  acceptRequest,
  rejectRequest,
} from "@/services/firestore/userService";

type SearchStatus = "idle" | "loading" | "found" | "not_found";

export default function PartnerScreen() {
  const { profile, requests } = useAuth();
  const [term, setTerm] = useState("");
  const [hit, setHit] = useState<any>(null);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const handleSearch = async () => {
    if (!profile || !term.trim()) return;
    setStatus("loading");
    setHit(null);
    setFeedback("");
    const user = await searchUser(term.trim().replace("@", ""), profile.uid);
    if (user) {
      setHit(user);
      setStatus("found");
    } else {
      setStatus("not_found");
      setFeedback("No partner found with that username.");
    }
  };

  const handleSend = async () => {
    if (!profile || !hit) return;
    setSending(true);
    try {
      await sendPartnerRequest(profile, hit);
      setFeedback("Invite sent! 💌");
      setHit(null);
      setTerm("");
      setStatus("idle");
    } catch (e: any) {
      setFeedback(e?.message ?? "Could not send invite.");
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Title */}
            <View style={styles.titleRow}>
              <Link2 size={22} color={Colors.primary} />
              <View>
                <Text style={styles.title}>Connect a Partner</Text>
                <Text style={styles.subtitle}>
                  Search by username to link your accounts
                </Text>
              </View>
            </View>

            {/* Search field */}
            <View style={styles.searchRow}>
              <View style={styles.searchInput}>
                <AuthInput
                  label="Username"
                  value={term}
                  onChangeText={(t) => {
                    setTerm(t);
                    setStatus("idle");
                    setFeedback("");
                  }}
                  placeholder="@username"
                  autoCapitalize="none"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                  rightAction={
                    status === "loading" ? (
                      <ActivityIndicator size="small" color={Colors.primaryLight} />
                    ) : (
                      <Pressable onPress={handleSearch} hitSlop={8}>
                        <Search size={18} color={Colors.primaryLight} />
                      </Pressable>
                    )
                  }
                />
              </View>
            </View>

            {/* Feedback text */}
            {!!feedback && (
              <Text
                style={[
                  styles.feedback,
                  feedback.includes("sent") ? styles.feedbackSuccess : styles.feedbackError,
                ]}
              >
                {feedback}
              </Text>
            )}

            {/* Search result card */}
            {status === "found" && hit && (
              <View style={styles.resultCard}>
                <View style={styles.resultAvatar}>
                  <Text style={styles.resultAvatarText}>
                    {hit.username?.[0]?.toUpperCase() ?? "?"}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{hit.displayName ?? hit.username}</Text>
                  <Text style={styles.resultUsername}>@{hit.username}</Text>
                </View>
                <Pressable
                  onPress={handleSend}
                  disabled={sending}
                  style={({ pressed }) => [
                    styles.inviteBtn,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <LinearGradient
                    colors={Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.inviteBtnGradient}
                  >
                    {sending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <UserPlus size={15} color="#fff" />
                        <Text style={styles.inviteBtnText}>Invite</Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            {/* Incoming requests label */}
            {requests?.length > 0 && (
              <Text style={styles.sectionLabel}>Incoming Requests</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestAvatar}>
              <Text style={styles.requestAvatarText}>
                {item.fromUsername?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <View style={styles.requestInfo}>
              <Text style={styles.requestName}>@{item.fromUsername}</Text>
              <Text style={styles.requestSub}>Wants to be your partner</Text>
            </View>
            <View style={styles.requestActions}>
              <Pressable
                onPress={() => acceptRequest(item)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.actionBtnAccept,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Check size={16} color={Colors.teal} />
              </Pressable>
              <Pressable
                onPress={() => rejectRequest(item.id)}
                style={({ pressed }) => [
                  styles.actionBtn,
                  styles.actionBtnReject,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <X size={16} color={Colors.secondary} />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          requests?.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>💞</Text>
              <Text style={styles.emptyText}>No incoming requests yet.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 8,
    gap: 16,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
  },
  searchRow: {
    gap: 10,
  },
  searchInput: {
    flex: 1,
  },
  feedback: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: -4,
  },
  feedbackSuccess: {
    color: Colors.tealLight,
  },
  feedbackError: {
    color: Colors.danger,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 14,
  },
  resultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(127,119,221,0.20)",
    borderWidth: 0.5,
    borderColor: "rgba(127,119,221,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primaryLight,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  resultUsername: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  inviteBtn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  inviteBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inviteBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 8,
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(212,83,126,0.15)",
    borderWidth: 0.5,
    borderColor: "rgba(212,83,126,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  requestAvatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.secondaryLight,
  },
  requestInfo: {
    flex: 1,
    gap: 2,
  },
  requestName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  requestSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
  actionBtnAccept: {
    backgroundColor: "rgba(29,158,117,0.12)",
    borderColor: "rgba(29,158,117,0.30)",
  },
  actionBtnReject: {
    backgroundColor: "rgba(212,83,126,0.12)",
    borderColor: "rgba(212,83,126,0.30)",
  },
  emptyWrap: {
    alignItems: "center",
    paddingTop: 40,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});