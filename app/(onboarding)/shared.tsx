import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Check, Sparkles } from "lucide-react-native";
import Colors from "@/constants/colors";
import { AuthInput } from "@/components/auth/AuthInput";
import { useAuth } from "@/providers/AuthProvider";
import {
  setPetType,
  suggestName,
  approveName,
} from "@/services/firestore/userService";

const PET_TYPES = ["blob", "fox", "bunny", "alien", "cloud spirit"] as const;
type PetType = typeof PET_TYPES[number];

const PET_EMOJIS: Record<PetType, string> = {
  blob: "🫧",
  fox: "🦊",
  bunny: "🐰",
  alien: "👽",
  "cloud spirit": "☁️",
};

export default function SharedScreen() {
  const { profile, relationship } = useAuth();
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<PetType | null>(null);

  if (!relationship || !profile) return null;

  const mySuggestion = (relationship.nameSuggestions ?? {})[profile.uid];
  const partnerSuggestion =
    Object.entries(relationship.nameSuggestions ?? {}).find(
      ([uid]) => uid !== profile.uid
    )?.[1] ?? null;

  const isPetTypeStep = relationship.onboardingStep === "pet_type";

  const handleSelectType = async (type: PetType) => {
    setSelectedType(type);
    await setPetType(relationship.id, type);
  };

  const handleSuggestName = async () => {
    if (!name.trim()) return;
    await suggestName(relationship.id, profile.uid, name.trim());
    setName("");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Shared Pet Setup</Text>
          <Text style={styles.subtitle}>
            Both partners configure your new companion together.
          </Text>
        </View>

        {/* Pet Type Selection */}
        {isPetTypeStep && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Choose a pet type</Text>
            <View style={styles.petGrid}>
              {PET_TYPES.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => handleSelectType(type)}
                    style={({ pressed }) => [
                      styles.petCard,
                      isSelected && styles.petCardSelected,
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    {isSelected && (
                      <LinearGradient
                        colors={["rgba(127,119,221,0.20)", "rgba(212,83,126,0.10)"]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                    <Text style={styles.petEmoji}>{PET_EMOJIS[type]}</Text>
                    <Text style={[styles.petLabel, isSelected && styles.petLabelSelected]}>
                      {type}
                    </Text>
                    {isSelected && (
                      <View style={styles.petCheck}>
                        <Check size={11} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Name Suggestion */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Suggest a name</Text>
          <AuthInput
            label="Pet name"
            value={name}
            onChangeText={setName}
            placeholder="Something cozy..."
            returnKeyType="done"
            onSubmitEditing={handleSuggestName}
            rightAction={
              <Pressable onPress={handleSuggestName} hitSlop={8}>
                <Sparkles size={17} color={Colors.primaryLight} />
              </Pressable>
            }
          />
          <Pressable
            onPress={handleSuggestName}
            style={({ pressed }) => [styles.suggestBtn, pressed && { opacity: 0.85 }]}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.suggestBtnGradient}
            >
              <Sparkles size={15} color="#fff" />
              <Text style={styles.suggestBtnText}>Suggest name</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Name Review */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Name proposals</Text>
          <View style={styles.proposalsCard}>
            {/* Your suggestion */}
            <View style={styles.proposalRow}>
              <View style={styles.proposalMeta}>
                <Text style={styles.proposalWho}>You suggested</Text>
                <Text style={styles.proposalName}>
                  {mySuggestion ?? <Text style={styles.proposalEmpty}>Nothing yet</Text>}
                </Text>
              </View>
            </View>

            <View style={styles.proposalDivider} />

            {/* Partner suggestion */}
            <View style={styles.proposalRow}>
              <View style={styles.proposalMeta}>
                <Text style={styles.proposalWho}>Partner suggested</Text>
                <Text style={styles.proposalName}>
                  {partnerSuggestion ?? (
                    <Text style={styles.proposalEmpty}>Waiting…</Text>
                  )}
                </Text>
              </View>
              {partnerSuggestion && (
                <Pressable
                  onPress={() => approveName(relationship, profile.uid, partnerSuggestion)}
                  style={({ pressed }) => [
                    styles.approveBtn,
                    pressed && { opacity: 0.75 },
                  ]}
                >
                  <LinearGradient
                    colors={Colors.gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.approveBtnGradient}
                  >
                    <Check size={14} color="#fff" />
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    marginTop: 8,
    marginBottom: 28,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  petGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  petCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
    position: "relative",
  },
  petCardSelected: {
    borderColor: "rgba(127,119,221,0.55)",
    borderWidth: 1,
  },
  petEmoji: {
    fontSize: 32,
  },
  petLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textMuted,
    textTransform: "capitalize",
  },
  petLabelSelected: {
    color: Colors.primaryLight,
  },
  petCheck: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestBtn: {
    borderRadius: 14,
    overflow: "hidden",
  },
  suggestBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  suggestBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  proposalsCard: {
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 20,
    overflow: "hidden",
  },
  proposalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  proposalDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  proposalMeta: {
    flex: 1,
    gap: 3,
  },
  proposalWho: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textHint,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  proposalName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  proposalEmpty: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.textHint,
  },
  approveBtn: {
    borderRadius: 12,
    overflow: "hidden",
  },
  approveBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  approveBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});