import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import type { Outfit } from "../../../types";

export async function saveOutfit(
  userId: string,
  data: Omit<Outfit, "id" | "createdAt">,
): Promise<Outfit> {
  const outfitsRef = collection(db, "users", userId, "outfits");
  const newDocRef = doc(outfitsRef);

  const newOutfit: Outfit = {
    ...data,
    id: newDocRef.id,
    createdAt: Date.now(),
  };

  await setDoc(newDocRef, newOutfit);
  return newOutfit;
}

export async function listSavedOutfits(userId: string): Promise<Outfit[]> {
  const outfitsRef = collection(db, "users", userId, "outfits");
  const q = query(outfitsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  const outfits: Outfit[] = [];

  snapshot.forEach((docSnap) => {
    outfits.push(docSnap.data() as Outfit);
  });

  return outfits;
}

export async function deleteSavedOutfit(
  userId: string,
  outfitId: string,
): Promise<void> {
  const docRef = doc(db, "users", userId, "outfits", outfitId);
  await deleteDoc(docRef);
}
