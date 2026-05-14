import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ExtraConfig = Record<string, string | undefined>;

const extraFromExpo = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;
const extraFromEas = (Constants.easConfig?.extra ?? {}) as ExtraConfig;
const extraFromManifest = (((Constants as any).manifest2?.extra ?? {}) as ExtraConfig);
const extra = { ...extraFromManifest, ...extraFromEas, ...extraFromExpo };

const getValue = (envKey: string, extraKey: keyof ExtraConfig) => process.env[envKey] ?? extra[extraKey];

const firebaseConfig = {
  apiKey: getValue("EXPO_PUBLIC_FIREBASE_API_KEY", "firebaseApiKey"),
  authDomain: getValue("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN", "firebaseAuthDomain"),
  projectId: getValue("EXPO_PUBLIC_FIREBASE_PROJECT_ID", "firebaseProjectId"),
  storageBucket: getValue("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET", "firebaseStorageBucket"),
  messagingSenderId: getValue("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "firebaseMessagingSenderId"),
  appId: getValue("EXPO_PUBLIC_FIREBASE_APP_ID", "firebaseAppId"),
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error(
    "Missing Firebase config. Add EXPO_PUBLIC_FIREBASE_* vars in .env or set firebase* keys under expo.extra in app.json.",
  );
}

const hasInitializedApp = getApps().length > 0;
const app = hasInitializedApp ? getApp() : initializeApp(firebaseConfig);

const auth = hasInitializedApp
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

const db = getFirestore(app);

export { app, auth, db };
