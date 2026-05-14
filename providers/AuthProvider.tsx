import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/services/firebase/config";
import { createOrGetProfile, listenProfile, listenRelationship, listenPet, listenRequests } from "@/services/firestore/userService";
import { emailLogin, emailSignUp, logoutUser, signInWithGoogleToken, useGooglePrompt } from "@/services/auth/authService";
import type { PartnerRequest, PetDoc, Relationship, UserProfile } from "@/types/models";

const AuthContext = createContext<any>(null);

const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [pet, setPet] = useState<PetDoc | null>(null);
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [request, response, promptAsync] = useGooglePrompt();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await createOrGetProfile({ uid: user.uid, displayName: user.displayName ?? "", username: `user_${user.uid.slice(0, 6)}`, inviteCode: genCode(), avatar: user.photoURL, email: user.email ?? "", partnerId: null, relationshipId: null, onboardingCompleted: false, pushToken: null, premium: false });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;
    return listenProfile(firebaseUser.uid, setProfile);
  }, [firebaseUser?.uid]);

  useEffect(() => {
    if (!profile?.uid) return;
    return listenRequests(profile.uid, setRequests);
  }, [profile?.uid]);

  useEffect(() => {
    if (!profile?.relationshipId) return;
    const unsubRel = listenRelationship(profile.relationshipId, setRelationship);
    return unsubRel;
  }, [profile?.relationshipId]);

  useEffect(() => {
    if (!relationship?.petId) return;
    return listenPet(relationship.petId, setPet);
  }, [relationship?.petId]);

  useEffect(() => {
    if (response?.type === "success") {
      signInWithGoogleToken(response.authentication?.idToken ?? "");
    }
  }, [response]);

  const value = useMemo(() => ({
    firebaseUser, profile, relationship, pet, requests, loading, authLoading, googleReady: !!request,
    login: async (email: string, password: string) => { setAuthLoading(true); try { await emailLogin(email, password);} finally {setAuthLoading(false);} },
    signup: async (email: string, password: string) => { setAuthLoading(true); try { await emailSignUp(email, password);} finally {setAuthLoading(false);} },
    loginGoogle: async () => promptAsync(),
    logout: logoutUser,
  }), [firebaseUser, profile, relationship, pet, requests, loading, authLoading, request]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
