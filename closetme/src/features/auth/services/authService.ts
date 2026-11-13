import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    updateProfile,
    type User,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";
import type { AuthUser } from "../../../types";

export function formatAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export async function signUpWithEmail(
  name: string,
  email: string,
  pass: string,
): Promise<AuthUser> {
  if (pass.length < 6) {
    throw new Error("A senha deve ter no mínimo 6 caracteres.");
  }

  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    pass,
  );
  await updateProfile(credential.user, { displayName: name.trim() });

  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: name.trim(),
  };
}

export async function signInWithEmail(
  email: string,
  pass: string,
): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return formatAuthUser(credential.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function translateAuthError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este e-mail já está em uso.";
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/weak-password":
      return "A senha deve ter no mínimo 6 caracteres.";
    default:
      return "Ocorreu um erro ao autenticar. Verifique sua conexão e tente novamente.";
  }
}
