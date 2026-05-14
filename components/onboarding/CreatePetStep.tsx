import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated, Pressable, ScrollView } from "react-native";
import { Egg, Sparkles, Check } from "lucide-react-native";
import Colors from "@/constants/colors";
import type { PetType } from "@/store/authStore";

interface CreatePetStepProps {
  onComplete: (name: string, petType: PetType) => void;
}

const petTypes: { type: PetType; label: string; emoji: string; desc: string; color: string }[] = [
  { type: "blob", label: "Blob", emoji: "\uD83D\uDC7E", desc: "Soft & squishy", color: "#FF9E8E" },
  { type: "fox", label: "Fox", emoji: "\uD83E\uDD8A", desc: "Clever & warm", color: "#F5C156" },
  { type: "bunny", label: "Bunny", emoji: "\uD83D\uDC30", desc: "Gentle & cuddly", color: "#FFB5A7" },
  { type: "alien", label: "Alien", emoji: "\uD83D\uDC7D", desc: "Mysterious & cool", color: "#80DEEA" },
  { type: "cloud", label: "Cloud", emoji: "\u2601\uFE0F", desc: "Dreamy & calm", color: "#C5CAE9" },
];

export default function CreatePetStep({ onComplete }: CreatePetStepProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [selectedType, setSelectedType] = useState<PetType | null>(null);
  const [petName, setPetName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleComplete = () => {
    if (!selectedType) {
      setError("Please choose a pet type");
      return;
    }
    const trimmed = petName.trim();
    if (trimmed.length < 2) {
      setError("Please give your pet a name (2+ characters)");
      return;
    }
    setError("");
    onComplete(trimmed, selectedType);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Egg size={24} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Meet your companion</Text>
        <Text style={styles.subtitle}>
          Choose a pet type and name it together. This little one will grow with your relationship.
        </Text>
      </View>

      {/* Pet Type Selection */}
      <Text style={styles.sectionLabel}>Choose a type</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.petTypesRow}
      >
        {petTypes.map((pet) => (
          <Pressable
            key={pet.type}
            onPress={() => {
              setSelectedType(pet.type);
              setError("");
            }}
            style={[
              styles.petTypeCard,
              selectedType === pet.type && styles.petTypeCardActive,
              { borderColor: selectedType === pet.type ? pet.color : Colors.border },
            ]}
          >
            <View
              style={[
                styles.petTypeIcon,
                { backgroundColor: `${pet.color}25` },
              ]}
            >
              <Text style={styles.petTypeEmoji}>{pet.emoji}</Text>
            </View>
            <Text style={styles.petTypeLabel}>{pet.label}</Text>
            <Text style={styles.petTypeDesc}>{pet.desc}</Text>
            {selectedType === pet.type && (
              <View style={[styles.checkBadge, { backgroundColor: pet.color }]}>
                <Check size={12} color="#FFF" strokeWidth={3} />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>

      {/* Pet Name */}
      <View style={styles.nameSection}>
        <Text style={styles.sectionLabel}>Name your pet</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="e.g. Mochi, Luna, Pixel"
          placeholderTextColor={Colors.textLight}
          value={petName}
          onChangeText={(text) => {
            setPetName(text);
            setError("");
          }}
          autoCapitalize="words"
          maxLength={16}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Preview */}
      {selectedType && petName.trim().length >= 2 && (
        <Animated.View style={styles.previewCard}>
          <Sparkles size={16} color={Colors.accent} />
          <Text style={styles.previewText}>
            You are about to welcome{" "}
            <Text style={styles.previewName}>{petName.trim()}</Text> the{" "}
            {petTypes.find((p) => p.type === selectedType)?.label} into your home.
          </Text>
        </Animated.View>
      )}

      <Pressable
        onPress={handleComplete}
        style={[styles.button, (!selectedType || petName.trim().length < 2) && styles.buttonDisabled]}
        disabled={!selectedType || petName.trim().length < 2}
      >
        <Text style={styles.buttonText}>Start Our Journey</Text>
        <Sparkles size={18} color={Colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(245,193,86,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: 12,
    marginLeft: 4,
  },
  petTypesRow: {
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  petTypeCard: {
    width: 110,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    position: "relative",
  },
  petTypeCardActive: {
    backgroundColor: "rgba(255,255,255,0.06)",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  petTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  petTypeEmoji: {
    fontSize: 28,
  },
  petTypeLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 2,
  },
  petTypeDesc: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: "500",
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  nameSection: {
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 13,
    color: Colors.danger,
    marginTop: 8,
    marginLeft: 4,
  },
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.surfaceWarm,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,140,100,0.15)",
  },
  previewText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  previewName: {
    fontWeight: "800",
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    borderRadius: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textDark,
  },
});
