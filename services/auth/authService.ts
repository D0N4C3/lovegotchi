import Constants from "expo-constants";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { auth } from "@/services/firebase/config";

WebBrowser.maybeCompleteAuthSession();

type ExtraConfig = Record<string, string | undefined>;

const extraFromExpo = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;
const extraFromEas = (Constants.easConfig?.extra ?? {}) as ExtraConfig;
const extraFromManifest = (((Constants as any).manifest2?.extra ?? {}) as ExtraConfig);
const extra = { ...extraFromManifest, ...extraFromEas, ...extraFromExpo };

const getGoogleConfigValue = (envKey: string, extraKey: keyof ExtraConfig, fallbackValue?: string) =>
  process.env[envKey] ?? extra[extraKey] ?? fallbackValue;

const googleAuthConfig = {
  expoClientId: getGoogleConfigValue(
    "EXPO_PUBLIC_GOOGLE_OAUTH_EXPO_CLIENT_ID",
    "googleOauthExpoClientId",
    "1082720826925-7pgvfi2ohf5mrpfveapm34nit9qqjj5q.apps.googleusercontent.com",
  ),
  clientId: getGoogleConfigValue(
    "EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID",
    "googleOauthWebClientId",
    "1082720826925-7pgvfi2ohf5mrpfveapm34nit9qqjj5q.apps.googleusercontent.com",
  ),
  iosClientId: getGoogleConfigValue("EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID", "googleOauthIosClientId"),
  androidClientId: getGoogleConfigValue(
    "EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID",
    "googleOauthAndroidClientId",
    "1082720826925-lb4639eg5k2gh3u7u273s6a4ldus9qeu.apps.googleusercontent.com",
  ),
};

export const emailSignUp = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const emailLogin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const logoutUser = () => signOut(auth);

export const useGooglePrompt = () =>
  Google.useAuthRequest({
    expoClientId: googleAuthConfig.expoClientId,
    clientId: googleAuthConfig.clientId,
    iosClientId: googleAuthConfig.iosClientId,
    androidClientId: googleAuthConfig.androidClientId,
    redirectUri: makeRedirectUri({
      scheme: "lovegotchi",
      path: "oauthredirect",
    }),
  });

export const signInWithGoogleToken = async (idToken: string) => {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};
