import Constants from "expo-constants";
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extras = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? extras.firebaseApiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extras.firebaseAuthDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extras.firebaseProjectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extras.firebaseStorageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? extras.firebaseMessagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? extras.firebaseAppId,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error("Missing Firebase config. Set EXPO_PUBLIC_FIREBASE_* variables.");
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
