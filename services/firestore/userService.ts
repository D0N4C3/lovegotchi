import { collection, doc, getDoc, getDocs, onSnapshot, query, runTransaction, serverTimestamp, setDoc, updateDoc, where } from "@react-native-firebase/firestore";
import { db } from "@/services/firebase/config";
import type { PartnerRequest, PetDoc, Relationship, UserProfile, PetType } from "@/types/models";

const usersCol = collection(db, "users");
const reqCol = collection(db, "partner_requests");


const FIRESTORE_UNAVAILABLE_CODE = "firestore/unavailable";
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 300;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isTransientFirestoreError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;
  const code = (error as { code?: string }).code;
  const message = (error as { message?: string }).message;
  return code === FIRESTORE_UNAVAILABLE_CODE || message?.includes(FIRESTORE_UNAVAILABLE_CODE) === true;
};

const withFirestoreRetry = async <T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientFirestoreError(error) || attempt >= retries) {
        throw error;
      }

      const delay = BASE_DELAY_MS * 2 ** attempt;
      await wait(delay);
      attempt += 1;
    }
  }
};


export const createOrGetProfile = async (profile: Omit<UserProfile, "createdAt">) => {
  const ref = doc(db, "users", profile.uid);
  const snap = await withFirestoreRetry(() => getDoc(ref));
  if (!snap.exists()) {
    await setDoc(ref, { ...profile, createdAt: new Date().toISOString() });
  }
};

export const listenProfile = (uid: string, cb: (p: UserProfile | null) => void) => onSnapshot(doc(db, "users", uid), (s) => cb(s.exists() ? (s.data() as UserProfile) : null));

export const searchUser = async (term: string, selfUid: string) => {
  const usernameQ = query(usersCol, where("username", "==", term.toLowerCase()));
  const inviteQ = query(usersCol, where("inviteCode", "==", term.toUpperCase()));
  const [u, c] = await withFirestoreRetry(() => Promise.all([getDocs(usernameQ), getDocs(inviteQ)]));
  const hit = u.docs[0] ?? c.docs[0];
  if (!hit || hit.id === selfUid) return null;
  return hit.data() as UserProfile;
};

export const sendPartnerRequest = async (from: UserProfile, to: UserProfile) => {
  if (from.uid === to.uid) throw new Error("You can't send a request to yourself.");
  const id = `${from.uid}_${to.uid}`;
  const ref = doc(db, "partner_requests", id);
  await withFirestoreRetry(() => runTransaction(db, async (tx) => {
    const [fromSnap, toSnap, existing] = await Promise.all([tx.get(doc(db, "users", from.uid)), tx.get(doc(db, "users", to.uid)), tx.get(ref)]);
    if (!fromSnap.exists() || !toSnap.exists()) throw new Error("User not found.");
    if (fromSnap.data().partnerId || toSnap.data().partnerId) throw new Error("One user already has a partner.");
    if (existing.exists() && existing.data().status === "pending") throw new Error("Request already pending.");
    tx.set(ref, { id, fromUid: from.uid, toUid: to.uid, fromUsername: from.username, toUsername: to.username, status: "pending", createdAt: new Date().toISOString() } satisfies PartnerRequest);
  }));
};

export const listenRequests = (uid: string, cb: (rows: PartnerRequest[]) => void) => {
  const q = query(reqCol, where("toUid", "==", uid), where("status", "==", "pending"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as PartnerRequest)));
};

export const cancelRequest = async (id: string) => withFirestoreRetry(() => updateDoc(doc(db, "partner_requests", id), { status: "cancelled" }));
export const rejectRequest = async (id: string) => withFirestoreRetry(() => updateDoc(doc(db, "partner_requests", id), { status: "rejected" }));

export const acceptRequest = async (request: PartnerRequest) => {
  await withFirestoreRetry(() => runTransaction(db, async (tx) => {
    const reqRef = doc(db, "partner_requests", request.id);
    const fromRef = doc(db, "users", request.fromUid);
    const toRef = doc(db, "users", request.toUid);
    const [reqSnap, fromSnap, toSnap] = await Promise.all([tx.get(reqRef), tx.get(fromRef), tx.get(toRef)]);
    if (!reqSnap.exists() || reqSnap.data().status !== "pending") throw new Error("Request no longer available.");
    const fromData = fromSnap.data();
    const toData = toSnap.data();
    if (!fromData || !toData) throw new Error("User missing.");
    if (fromData.partnerId || toData.partnerId) throw new Error("User already linked.");

    const relationshipRef = doc(collection(db, "relationships"));
    const petRef = doc(collection(db, "pets"));

    const relationship: Relationship = {
      id: relationshipRef.id,
      members: [request.fromUid, request.toUid],
      petId: petRef.id,
      createdAt: new Date().toISOString(),
      onboardingStep: "pet_type",
      nameSuggestions: {},
      nameApprovals: {},
    };
    const pet: PetDoc = {
      petId: petRef.id,
      relationshipId: relationshipRef.id,
      petType: null,
      petName: null,
      stage: "egg",
      happiness: 65,
      hunger: 60,
      energy: 75,
      love: 50,
      evolutionXp: 0,
      createdAt: new Date().toISOString(),
      lastInteractionAt: new Date().toISOString(),
      alive: true,
      mood: "happy",
      cosmetics: [],
      sharedRoomData: {},
    };

    tx.set(relationshipRef, relationship);
    tx.set(petRef, pet);
    tx.update(fromRef, { partnerId: request.toUid, relationshipId: relationshipRef.id, onboardingCompleted: false });
    tx.update(toRef, { partnerId: request.fromUid, relationshipId: relationshipRef.id, onboardingCompleted: false });
    tx.update(reqRef, { status: "accepted", acceptedAt: serverTimestamp() });
  }));
};

export const listenRelationship = (relationshipId: string, cb: (r: Relationship | null) => void) => onSnapshot(doc(db, "relationships", relationshipId), (s) => cb(s.exists() ? (s.data() as Relationship) : null));
export const listenPet = (petId: string, cb: (p: PetDoc | null) => void) => onSnapshot(doc(db, "pets", petId), (s) => cb(s.exists() ? (s.data() as PetDoc) : null));

export const setPetType = (relationshipId: string, petType: PetType) => withFirestoreRetry(() => updateDoc(doc(db, "relationships", relationshipId), { onboardingStep: "name_vote", petType }));
export const suggestName = (relationshipId: string, uid: string, name: string) => withFirestoreRetry(() => updateDoc(doc(db, "relationships", relationshipId), { [`nameSuggestions.${uid}`]: name.trim() }));

export const approveName = async (relationship: Relationship, uid: string, name: string) => {
  const relRef = doc(db, "relationships", relationship.id);
  await withFirestoreRetry(() => runTransaction(db, async (tx) => {
    const relSnap = await tx.get(relRef);
    const rel = relSnap.data() as Relationship;
    const approvals = { ...(rel.nameApprovals ?? {}), [uid]: name };
    tx.update(relRef, { nameApprovals: approvals });
    const names = Object.values(approvals);
    if (names.length >= 2 && new Set(names).size === 1) {
      tx.update(relRef, { onboardingStep: "completed" });
      tx.update(doc(db, "pets", rel.petId), { petName: name, petType: (rel as any).petType ?? "blob", stage: "baby" });
      rel.members.forEach((memberId) => tx.update(doc(db, "users", memberId), { onboardingCompleted: true }));
    }
  }));
};
