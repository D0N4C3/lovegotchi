import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
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

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / TOTAL_STEPS,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const animateSlide = (direction: 1 | -1, callback: () => void) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: direction * -30,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      animateSlide(1, () => setStep((s) => s + 1));
    }
  };

  const goBack = () => {
    if (step > 0) {
      animateSlide(-1, () => setStep((s) => s - 1));
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
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          {step > 0 && (
            <Pressable onPress={goBack} style={styles.backButton}>
              <ChevronLeft size={20} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Step Content */}
        <Animated.View
          style={[
            styles.stepContent,
            { transform: [{ translateX: slideAnim }] },
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressBarContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    position: "relative",
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  backButton: {
    position: "absolute",
    left: -8,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepContent: {
    flex: 1,
  },
});
