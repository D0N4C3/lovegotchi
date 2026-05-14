import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "@react-native-firebase/auth";
import { auth } from "@/services/firebase/config";

const googleServices = require("../../google-services.json");

const webClientId: string | undefined =
  googleServices?.client?.[0]?.oauth_client?.find((client: { client_type: number }) => client.client_type === 3)?.client_id;

GoogleSignin.configure({
  webClientId,
  offlineAccess: false,
});

const getAuthCode = (error: unknown) => {
  if (!error || typeof error !== "object" || !("code" in error)) return null;
  const code = (error as { code?: string }).code;
  return typeof code === "string" ? code : null;
};

const normalizeAuthError = (error: unknown) => {
  const code = getAuthCode(error);

  if (!code) {
    return error;
  }

  const mappedMessage: Record<string, string> = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled. Please contact support.",
    "auth/too-many-requests": "Too many failed attempts. Try again in a few minutes.",
    "auth/network-request-failed": "Network error. Check your internet connection and try again.",
  };

  const fallback = mappedMessage[code];
  if (!fallback) {
    return error;
  }

  const wrapped = new Error(fallback);
  (wrapped as Error & { code?: string }).code = code;
  return wrapped;
};

export const emailSignUp = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    await sendEmailVerification(cred.user);
    return cred;
  } catch (error) {
    throw normalizeAuthError(error);
  }
};

export const emailLogin = async (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    return await signInWithEmailAndPassword(auth, normalizedEmail, password);
  } catch (error) {
    const code = getAuthCode(error);

    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
      const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);

      if (methods.includes("google.com")) {
        throw new Error("This email is linked to Google Sign-In. Please tap ‘Continue with Google’.");
      }

      throw new Error("That email/password combination was not recognized. Double-check your password or reset it.");
    }

    throw normalizeAuthError(error);
  }
};

export const requestPasswordReset = (email: string) => sendPasswordResetEmail(auth, email.trim().toLowerCase());

export const logoutUser = () => signOut(auth);

export const loginWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();
  const token = result.data?.idToken ?? result.idToken;

  if (!token) {
    throw new Error("Google Sign-In succeeded, but no ID token was returned.");
  }

  return signInWithCredential(auth, GoogleAuthProvider.credential(token));
};
