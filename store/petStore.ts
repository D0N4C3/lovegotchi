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

export interface DailyQuest {
  id: "daily_care" | "bonding_time" | "play_date";
  title: string;
  target: number;
  progress: number;
  rewardXp: number;
  rewardLove: number;
  completed: boolean;
}

export interface PetState {
  name: string;
  petType: PetType | null;
  stage: PetStage;
  mood: PetMood;
  hunger: number;
  energy: number;
  cleanliness: number;
  love: number;
  happiness: number;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastInteraction: string | null;
  lastInteractionAt: number;
  memories: Memory[];
  decorations: string[];
  careActionsToday: string[];
  lastCareReset: string;
  achievements: string[];
  dailyQuests: DailyQuest[];
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
  runGameTick: () => void;
  setMood: (mood: PetMood) => void;
  addXp: (amount: number) => void;
  addAchievement: (achievement: string) => void;
  resetPet: () => void;
}

const getTodayKey = () => new Date().toISOString().split("T")[0];
const now = () => Date.now();

const clamp = (value: number) => Math.max(0, Math.min(100, value));

const createDailyQuests = (): DailyQuest[] => [
  { id: "daily_care", title: "Complete 3 care rituals", target: 3, progress: 0, rewardXp: 30, rewardLove: 5, completed: false },
  { id: "bonding_time", title: "Use cuddle/talk 2 times", target: 2, progress: 0, rewardXp: 25, rewardLove: 10, completed: false },
  { id: "play_date", title: "Play once", target: 1, progress: 0, rewardXp: 20, rewardLove: 4, completed: false },
];

const initialState: PetState = {
  name: "Mochi",
  petType: null,
  stage: "egg",
  mood: "happy",
  hunger: 70,
  energy: 80,
  cleanliness: 70,
  love: 60,
  happiness: 75,
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastInteraction: null,
  lastInteractionAt: now(),
  memories: [],
  decorations: ["bed", "lamp"],
  careActionsToday: [],
  lastCareReset: getTodayKey(),
  achievements: [],
  dailyQuests: createDailyQuests(),
  isCreated: false,
};

export const usePetStore = create<PetState & PetActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setPetType: (petType) => set({ petType }),
      createPet: (name, petType) =>
        set({ ...initialState, name, petType, stage: "baby", isCreated: true, achievements: ["First Day"], lastInteraction: getTodayKey() }),

      runGameTick: () => {
        const elapsedHours = (now() - get().lastInteractionAt) / (1000 * 60 * 60);
        if (elapsedHours < 1) return;
        const decay = Math.floor(elapsedHours);
        set((state) => {
          const hunger = clamp(state.hunger - decay * 6);
          const energy = clamp(state.energy - decay * 4);
          const cleanliness = clamp(state.cleanliness - decay * 3);
          const love = clamp(state.love - (hunger < 30 ? decay * 2 : decay));
          const happiness = clamp(state.happiness - (energy < 30 ? decay * 3 : decay * 2));

          let mood: PetMood = "happy";
          if (hunger < 30) mood = "hungry";
          else if (energy < 30) mood = "sleepy";
          else if (love < 35) mood = "lonely";

          return { hunger, energy, cleanliness, love, happiness, mood, lastInteractionAt: now() };
        });
      },

      feed: () => {
        if (get().careActionsToday.includes("feed")) return;
        set((state) => ({
          hunger: clamp(state.hunger + 25), happiness: clamp(state.happiness + 6), love: clamp(state.love + 3), xp: state.xp + 15,
          careActionsToday: [...state.careActionsToday, "feed"], mood: "happy", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },
      play: () => {
        if (get().careActionsToday.includes("play")) return;
        set((state) => ({
          happiness: clamp(state.happiness + 22), energy: clamp(state.energy - 15), cleanliness: clamp(state.cleanliness - 8), love: clamp(state.love + 5), xp: state.xp + 20,
          careActionsToday: [...state.careActionsToday, "play"], mood: "playful", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },
      cuddle: () => {
        if (get().careActionsToday.includes("cuddle")) return;
        set((state) => ({
          love: clamp(state.love + 20), happiness: clamp(state.happiness + 10), energy: clamp(state.energy + 4), xp: state.xp + 12,
          careActionsToday: [...state.careActionsToday, "cuddle"], mood: "excited", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },
      sleep: () => {
        if (get().careActionsToday.includes("sleep")) return;
        set((state) => ({
          energy: clamp(state.energy + 30), hunger: clamp(state.hunger - 10), cleanliness: clamp(state.cleanliness + 6), xp: state.xp + 10,
          careActionsToday: [...state.careActionsToday, "sleep"], mood: "sleepy", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },
      bathe: () => {
        if (get().careActionsToday.includes("bathe")) return;
        set((state) => ({
          cleanliness: clamp(state.cleanliness + 30), happiness: clamp(state.happiness + 15), love: clamp(state.love + 5), xp: state.xp + 12,
          careActionsToday: [...state.careActionsToday, "bathe"], mood: "happy", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },
      talk: () => {
        if (get().careActionsToday.includes("talk")) return;
        set((state) => ({
          love: clamp(state.love + 15), happiness: clamp(state.happiness + 8), xp: state.xp + 8,
          careActionsToday: [...state.careActionsToday, "talk"], mood: "excited", lastInteractionAt: now(),
        }));
        get().addXp(0);
      },

      addMemory: (memory) => set((state) => ({ memories: [{ ...memory, id: Date.now().toString() }, ...state.memories] })),
      addDecoration: (decoration) => set((state) => ({ decorations: [...state.decorations, decoration] })),
      checkDailyReset: () => {
        const today = getTodayKey();
        if (get().lastCareReset !== today) {
          set((state) => {
            const hadInteraction = state.careActionsToday.length > 0;
            const newStreak = hadInteraction ? state.streak + 1 : 0;
            return {
              careActionsToday: [],
              dailyQuests: createDailyQuests(),
              lastCareReset: today,
              streak: newStreak,
              longestStreak: Math.max(state.longestStreak, newStreak),
              hunger: clamp(state.hunger - 12),
              energy: clamp(state.energy - 8),
              cleanliness: clamp(state.cleanliness - 10),
              love: clamp(state.love - 5),
              happiness: clamp(state.happiness - 8),
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
          const newStage = newLevel >= 20 ? "legendary" : newLevel >= 15 ? "adult" : newLevel >= 10 ? "teen" : newLevel >= 5 ? "child" : "baby";

          const nextQuests = state.dailyQuests.map((q) => {
            if (q.completed) return q;
            const added = q.id === "daily_care" ? state.careActionsToday.length : q.id === "bonding_time" ? state.careActionsToday.filter((a) => a === "cuddle" || a === "talk").length : state.careActionsToday.filter((a) => a === "play").length;
            const progress = Math.min(q.target, added);
            const completed = progress >= q.target;
            if (completed && !q.completed) {
              return { ...q, progress, completed };
            }
            return { ...q, progress, completed };
          });

          const completedNow = nextQuests.filter((q) => q.completed && !state.dailyQuests.find((x) => x.id === q.id)?.completed);
          const bonusXp = completedNow.reduce((n, q) => n + q.rewardXp, 0);
          const bonusLove = completedNow.reduce((n, q) => n + q.rewardLove, 0);

          return {
            xp: newXp + bonusXp,
            level: Math.floor((newXp + bonusXp) / 100) + 1,
            stage: newStage,
            love: clamp(state.love + bonusLove),
            dailyQuests: nextQuests,
          };
        });
      },
      addAchievement: (achievement) => set((state) => ({ achievements: state.achievements.includes(achievement) ? state.achievements : [...state.achievements, achievement] })),
      resetPet: () => set(initialState),
    }),
    { name: "lovegotchi-pet-storage", storage: createJSONStorage(() => AsyncStorage) }
  )
);
