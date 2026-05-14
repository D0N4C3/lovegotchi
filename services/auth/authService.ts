import Constants from "expo-constants";
import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, signOut } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { auth } from "@/services/firebase/config";

WebBrowser.maybeCompleteAuthSession();
type ExtraConfig = Record<string, string | undefined>;
const extra = { ...(((Constants as any).manifest2?.extra ?? {}) as ExtraConfig), ...((Constants.easConfig?.extra ?? {}) as ExtraConfig), ...((Constants.expoConfig?.extra ?? {}) as ExtraConfig) };
const getGoogleConfigValue = (envKey: string, extraKey: keyof ExtraConfig, fallbackValue?: string) => process.env[envKey] ?? extra[extraKey] ?? fallbackValue;

const googleAuthConfig = {
  expoClientId: getGoogleConfigValue("EXPO_PUBLIC_GOOGLE_OAUTH_EXPO_CLIENT_ID", "googleOauthExpoClientId"),
  webClientId: getGoogleConfigValue("EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID", "googleOauthWebClientId"),
  iosClientId: getGoogleConfigValue("EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID", "googleOauthIosClientId"),
  androidClientId: getGoogleConfigValue("EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID", "googleOauthAndroidClientId"),
};

export const emailSignUp = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  return cred;
};
export const emailLogin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const requestPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);
export const logoutUser = () => signOut(auth);

export const useGooglePrompt = () =>
  Google.useAuthRequest({
    expoClientId: googleAuthConfig.expoClientId,
    webClientId: googleAuthConfig.webClientId,
    iosClientId: googleAuthConfig.iosClientId,
    androidClientId: googleAuthConfig.androidClientId,
    redirectUri: makeRedirectUri({ scheme: "lovegotchi", path: "oauthredirect" }),
  });

export const signInWithGoogleToken = async (idToken: string) => signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
