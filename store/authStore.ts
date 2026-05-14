import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  username: string;
  displayName: string;
  status: "pending" | "accepted";
}

export type OnboardingStep =
  | "welcome"
  | "register"
  | "partner"
  | "create-pet"
  | "complete";

export type PetType = "blob" | "fox" | "bunny" | "alien" | "cloud";

export interface AuthState {
  user: User | null;
  partner: Partner | null;
  onboardingStep: OnboardingStep;
  isOnboarded: boolean;
  pendingInvites: string[];
}

interface AuthActions {
  setUser: (user: User) => void;
  setPartner: (partner: Partner | null) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  sendInvite: (username: string) => boolean;
  acceptInvite: (fromUsername: string) => void;
  logout: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const generateUsername = (displayName: string) => {
  const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `${base.slice(0, 12)}${suffix}`;
};

const initialState: AuthState = {
  user: null,
  partner: null,
  onboardingStep: "welcome",
  isOnboarded: false,
  pendingInvites: [],
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),

      setPartner: (partner) => set({ partner }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),

      completeOnboarding: () =>
        set({
          isOnboarded: true,
          onboardingStep: "complete",
        }),

      sendInvite: (username) => {
        const current = get();
        if (current.pendingInvites.includes(username)) return false;
        set({ pendingInvites: [...current.pendingInvites, username] });
        return true;
      },

      acceptInvite: (fromUsername) => {
        set((state) => ({
          pendingInvites: state.pendingInvites.filter((u) => u !== fromUsername),
        }));
      },

      logout: () => set(initialState),
    }),
    {
      name: "lovegotchi-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { generateUsername, generateId };
