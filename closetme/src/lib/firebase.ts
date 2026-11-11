declare const process: { env: Record<string, string | undefined> };

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ [ClosetMe] ATENÇÃO: O arquivo .env não foi carregado pelo Expo ou EXPO_PUBLIC_FIREBASE_API_KEY está vazio!",
  );
} else {
  console.log("✅ [ClosetMe] Chave da API encontrada com sucesso!");
}

const firebaseConfig = {
  apiKey: apiKey || "dummy-key-to-prevent-crash",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: Auth;
try {
  // @ts-ignore
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db: Firestore = getFirestore(app);
