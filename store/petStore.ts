import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PetType } from "@/store/authStore";

export type PetMood = "happy" | "sleepy" | "hungry" | "playful" | "lonely" | "excited";

export type PetStage = "egg" | "baby" | "child" | "teen" | "adult" | "legendary";

export interface Memory {
  id: string;
  title: string;
  date: string;
  type: "photo" | "voice" | "text";
  content: string;
  partnerName: string;
}

export interface PetState {
  name: string;
  petType: PetType | null;
  stage: PetStage;
  mood: PetMood;
  hunger: number;
  energy: number;
  love: number;
  happiness: number;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastInteraction: string | null;
  memories: Memory[];
  decorations: string[];
  careActionsToday: string[];
  lastCareReset: string;
  achievements: string[];
  isCreated: boolean;
}

interface PetActions {
  setName: (name: string) => void;
  setPetType: (type: PetType) => void;
  createPet: (name: string, petType: PetType) => void;
  feed: () => void;
  play: () => void;
  cuddle: () => void;
  sleep: () => void;
  bathe: () => void;
  talk: () => void;
  addMemory: (memory: Omit<Memory, "id">) => void;
  addDecoration: (decoration: string) => void;
  checkDailyReset: () => void;
  setMood: (mood: PetMood) => void;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  resetPet: () => void;
}

const getTodayKey = () => new Date().toISOString().split("T")[0];

const initialState: PetState = {
  name: "Mochi",
  petType: null,
  stage: "egg",
  mood: "happy",
  hunger: 70,
  energy: 80,
  love: 60,
  happiness: 75,
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastInteraction: null,
  memories: [],
  decorations: ["bed", "lamp"],
  careActionsToday: [],
  lastCareReset: getTodayKey(),
  achievements: [],
  isCreated: false,
};

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setName: (name) => set({ name }),

      setPetType: (petType) => set({ petType }),

      createPet: (name, petType) =>
        set({
          name,
          petType,
          stage: "baby",
          mood: "happy",
          hunger: 70,
          energy: 80,
          love: 60,
          happiness: 75,
          xp: 0,
          level: 1,
          streak: 0,
          longestStreak: 0,
          lastInteraction: getTodayKey(),
          memories: [],
          decorations: ["bed", "lamp"],
          careActionsToday: [],
          lastCareReset: getTodayKey(),
          achievements: ["First Day"],
          isCreated: true,
        }),

      feed: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("feed")) return;
        set((state) => ({
          hunger: Math.min(100, state.hunger + 25),
          happiness: Math.min(100, state.happiness + 5),
          love: Math.min(100, state.love + 3),
          xp: state.xp + 15,
          careActionsToday: [...state.careActionsToday, "feed"],
          mood: "happy" as PetMood,
        }));
        get().addXp(0);
      },

      play: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("play")) return;
        set((state) => ({
          happiness: Math.min(100, state.happiness + 20),
          energy: Math.max(0, state.energy - 15),
          love: Math.min(100, state.love + 5),
          xp: state.xp + 20,
          careActionsToday: [...state.careActionsToday, "play"],
          mood: "playful" as PetMood,
        }));
        get().addXp(0);
      },

      cuddle: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("cuddle")) return;
        set((state) => ({
          love: Math.min(100, state.love + 20),
          happiness: Math.min(100, state.happiness + 10),
          energy: Math.min(100, state.energy + 5),
          xp: state.xp + 10,
          careActionsToday: [...state.careActionsToday, "cuddle"],
          mood: "excited" as PetMood,
        }));
        get().addXp(0);
      },

      sleep: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("sleep")) return;
        set((state) => ({
          energy: Math.min(100, state.energy + 30),
          hunger: Math.max(0, state.hunger - 10),
          xp: state.xp + 10,
          careActionsToday: [...state.careActionsToday, "sleep"],
          mood: "sleepy" as PetMood,
        }));
        get().addXp(0);
      },

      bathe: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("bathe")) return;
        set((state) => ({
          happiness: Math.min(100, state.happiness + 15),
          love: Math.min(100, state.love + 5),
          xp: state.xp + 12,
          careActionsToday: [...state.careActionsToday, "bathe"],
          mood: "happy" as PetMood,
        }));
        get().addXp(0);
      },

      talk: () => {
        const today = getTodayKey();
        if (get().careActionsToday.includes("talk")) return;
        set((state) => ({
          love: Math.min(100, state.love + 15),
          happiness: Math.min(100, state.happiness + 8),
          xp: state.xp + 8,
          careActionsToday: [...state.careActionsToday, "talk"],
          mood: "excited" as PetMood,
        }));
        get().addXp(0);
      },

      addMemory: (memory) =>
        set((state) => ({
          memories: [
            {
              ...memory,
              id: Date.now().toString(),
            },
            ...state.memories,
          ],
        })),

      addDecoration: (decoration) =>
        set((state) => ({
          decorations: [...state.decorations, decoration],
        })),

      checkDailyReset: () => {
        const today = getTodayKey();
        if (get().lastCareReset !== today) {
          set((state) => {
            const newStreak = state.lastInteraction === state.lastCareReset ? state.streak + 1 : 1;
            return {
              careActionsToday: [],
              lastCareReset: today,
              streak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
              hunger: Math.max(0, state.hunger - 15),
              energy: Math.max(0, state.energy - 10),
              love: Math.max(0, state.love - 5),
              happiness: Math.max(0, state.happiness - 8),
              lastInteraction: today,
            };
          });
        }
      },

      setMood: (mood) => set({ mood }),

      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount;
          const newLevel = Math.floor(newXp / 100) + 1;
          const newStage =
            newLevel >= 20
              ? "legendary"
              : newLevel >= 15
                ? "adult"
                : newLevel >= 10
                  ? "teen"
                  : newLevel >= 5
                    ? "child"
                    : newLevel >= 2
                      ? "baby"
                      : "egg";
          return {
            xp: newXp,
            level: newLevel,
            stage: newStage,
          };
        });
      },

      addAchievement: (achievement) =>
        set((state) => ({
          achievements: state.achievements.includes(achievement)
            ? state.achievements
            : [...state.achievements, achievement],
        })),

      resetPet: () => set(initialState),
    }),
    {
      name: "lovegotchi-pet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
