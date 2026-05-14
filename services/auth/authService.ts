import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "@/services/firebase/config";

WebBrowser.maybeCompleteAuthSession();

export const emailSignUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const emailLogin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

export const useGooglePrompt = () =>
  Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID,
  });

export const signInWithGoogleToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};
