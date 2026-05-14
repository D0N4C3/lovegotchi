import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

/**
 * Native Firebase bootstrap.
 *
 * Uses Android configuration from google-services.json via
 * @react-native-firebase/app automatic initialization.
 */
const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
