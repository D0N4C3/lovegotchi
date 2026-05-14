export type PetType = "blob" | "fox" | "bunny" | "alien" | "cloud spirit";

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  inviteCode: string;
  avatar: string | null;
  email: string;
  partnerId: string | null;
  relationshipId: string | null;
  createdAt: string;
  onboardingCompleted: boolean;
  pushToken: string | null;
  premium: boolean;
}

export interface PartnerRequest {
  id: string;
  fromUid: string;
  toUid: string;
  fromUsername: string;
  toUsername: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
}

export interface Relationship {
  id: string;
  members: [string, string];
  petId: string;
  createdAt: string;
  onboardingStep: "pet_type" | "name_vote" | "completed";
  nameSuggestions: Record<string, string>;
  nameApprovals: Record<string, string>;
}

export interface PetDoc {
  petId: string;
  relationshipId: string;
  petType: PetType | null;
  petName: string | null;
  stage: "egg" | "baby" | "child" | "teen" | "adult" | "legendary";
  happiness: number;
  hunger: number;
  energy: number;
  love: number;
  evolutionXp: number;
  createdAt: string;
  lastInteractionAt: string;
  alive: boolean;
  mood: "happy" | "sleepy" | "hungry" | "playful" | "lonely" | "excited";
  cosmetics: string[];
  sharedRoomData: Record<string, unknown>;
}
