import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword, signOut } from "@react-native-firebase/auth";
import { auth } from "@/services/firebase/config";

const googleServices = require("../../google-services.json");

const webClientId: string | undefined =
  googleServices?.client?.[0]?.oauth_client?.find((client: { client_type: number }) => client.client_type === 3)?.client_id;

GoogleSignin.configure({
  webClientId,
  offlineAccess: false,
});

export const emailSignUp = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  return cred;
};

export const emailLogin = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const requestPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

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
