import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/colors";
import { useAuthStore, generateId, type PetType } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import RegisterStep from "@/components/onboarding/RegisterStep";
import PartnerStep from "@/components/onboarding/PartnerStep";
import CreatePetStep from "@/components/onboarding/CreatePetStep";

const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
  const router = useRouter();
  const { setUser, setPartner, completeOnboarding, setOnboardingStep } = useAuthStore();
  const { createPet } = usePetStore();

  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ displayName: "", username: "" });

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / TOTAL_STEPS,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, { toValue: 20, duration: 0, useNativeDriver: true }),
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      animateTransition(() => setStep((s) => s + 1));
    }
  };

  const goBack = () => {
    if (step > 0) {
      animateTransition(() => setStep((s) => s - 1));
    }
  };

  const handleRegister = (displayName: string, username: string) => {
    const user = {
      id: generateId(),
      username,
      displayName,
      createdAt: new Date().toISOString(),
    };
    setUser(user);
    setUserData({ displayName, username });
    setOnboardingStep("partner");
    goNext();
  };

  const handlePartner = (partnerUsername: string) => {
    const partner = {
      id: generateId(),
      username: partnerUsername,
      displayName: partnerUsername,
      status: "pending" as const,
    };
    setPartner(partner);
    setOnboardingStep("create-pet");
    goNext();
  };

  const handleSkipPartner = () => {
    setOnboardingStep("create-pet");
    goNext();
  };

  const handleCreatePet = (name: string, petType: PetType) => {
    createPet(name, petType);
    completeOnboarding();
    router.replace("/(tabs)");
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* Ambient background orbs */}
      <View style={[styles.orb, styles.orb1]} pointerEvents="none" />
      <View style={[styles.orb, styles.orb2]} pointerEvents="none" />

      <View style={styles.container}>
        {/* Header row: back button + progress */}
        <View style={styles.headerRow}>
          <View style={styles.backSlot}>
            {step > 0 && (
              <Pressable
                onPress={goBack}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.backButtonPressed,
                ]}
              >
                <ChevronLeft size={20} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
                <LinearGradient
                  colors={Colors.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <View style={styles.stepDots}>
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.stepDot,
                    i <= step && styles.stepDotActive,
                    i === step && styles.stepDotCurrent,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Step content */}
        <Animated.View
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {step === 0 && <WelcomeStep onNext={goNext} />}
          {step === 1 && <RegisterStep onNext={handleRegister} />}
          {step === 2 && (
            <PartnerStep
              myUsername={userData.username}
              onNext={handlePartner}
              onSkip={handleSkipPartner}
            />
          )}
          {step === 3 && <CreatePetStep onComplete={handleCreatePet} />}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orb1: {
    width: 260,
    height: 260,
    backgroundColor: Colors.primary,
    opacity: 0.12,
    top: -80,
    right: -60,
  },
  orb2: {
    width: 180,
    height: 180,
    backgroundColor: Colors.secondary,
    opacity: 0.10,
    bottom: 100,
    left: -60,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backSlot: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  backButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  progressWrap: {
    flex: 1,
    gap: 8,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    overflow: "hidden",
  },
  stepDots: {
    flexDirection: "row",
    gap: 6,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  stepDotActive: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.6,
  },
  stepDotCurrent: {
    backgroundColor: Colors.primaryLight,
    opacity: 1,
    width: 18,
  },
  stepContent: {
    flex: 1,
  },
});