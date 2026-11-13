import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Garment, GarmentCategory, Outfit } from '@/types';

export async function createGarment(
  userId: string,
  data: Omit<Garment, 'id' | 'createdAt'>
): Promise<Garment> {
  const garmentsRef = collection(db, 'users', userId, 'garments');
  const newDocRef = doc(garmentsRef);

  const newGarment: Garment = {
    ...data,
    id: newDocRef.id,
    createdAt: Date.now(),
  };

  await setDoc(newDocRef, newGarment);
  return newGarment;
}

export async function listGarments(
  userId: string,
  categoryFilter?: GarmentCategory | 'all'
): Promise<Garment[]> {
  const garmentsRef = collection(db, 'users', userId, 'garments');
  const q = query(garmentsRef, orderBy('createdAt', 'desc'));

  const snapshot = await getDocs(q);
  const garments: Garment[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as Garment;
    if (!categoryFilter || categoryFilter === 'all' || data.category === categoryFilter) {
      garments.push(data);
    }
  });

  return garments;
}

export async function getGarmentById(userId: string, garmentId: string): Promise<Garment | null> {
  const docRef = doc(db, 'users', userId, 'garments', garmentId);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return snap.data() as Garment;
  }

  return null;
}

// Verifica o impacto da exclusão da peça nos looks salvos
export async function checkGarmentDeletionImpact(
  userId: string,
  garmentId: string
): Promise<{
  affectedCount: number;
  updatedCount: number;
  deletedCount: number;
  affectedOutfits: { outfit: Outfit; remainingIds: string[]; isStillComplete: boolean }[];
}> {
  // 1. Busca todas as peças e todos os looks do usuário
  const allGarments = await listGarments(userId);
  const garmentsMap = new Map<string, Garment>(allGarments.map((g) => [g.id, g]));

  const outfitsRef = collection(db, 'users', userId, 'outfits');
  const snap = await getDocs(outfitsRef);
  const allOutfits: Outfit[] = [];
  snap.forEach((d) => allOutfits.push(d.data() as Outfit));

  // 2. Filtra os looks que usam esta peça
  const affectedOutfits = allOutfits
    .filter((o) => o.garmentIds.includes(garmentId))
    .map((outfit) => {
      const remainingIds = outfit.garmentIds.filter((id) => id !== garmentId);
      const remainingGarments = remainingIds
        .map((id) => garmentsMap.get(id))
        .filter((g): g is Garment => Boolean(g));

      const hasTop = remainingGarments.some((g) => g.category === 'top');
      const hasBottom = remainingGarments.some((g) => g.category === 'bottom');
      const hasOnePiece = remainingGarments.some((g) => g.category === 'one_piece');
      const hasShoes = remainingGarments.some((g) => g.category === 'shoes');

      // Look completo precisa de: (Top + Bottom + Shoes) OU (One-piece + Shoes)
      const isStillComplete = hasShoes && (hasOnePiece || (hasTop && hasBottom));

      return {
        outfit,
        remainingIds,
        isStillComplete,
      };
    });

  const updatedCount = affectedOutfits.filter((item) => item.isStillComplete).length;
  const deletedCount = affectedOutfits.filter((item) => !item.isStillComplete).length;

  return {
    affectedCount: affectedOutfits.length,
    updatedCount,
    deletedCount,
    affectedOutfits,
  };
}

// Executa a exclusão da peça e a atualização/remoção dos looks vinculados
export async function deleteGarmentWithCascade(
  userId: string,
  garmentId: string
): Promise<void> {
  const impact = await checkGarmentDeletionImpact(userId, garmentId);

  // 1. Apaga os looks que ficaram incompletos
  for (const item of impact.affectedOutfits) {
    const outfitDocRef = doc(db, 'users', userId, 'outfits', item.outfit.id);
    if (!item.isStillComplete) {
      await deleteDoc(outfitDocRef);
    } else {
      // Atualiza o look mantendo apenas as peças restantes
      await updateDoc(outfitDocRef, { garmentIds: item.remainingIds });
    }
  }

  // 2. Apaga a peça
  const garmentDocRef = doc(db, 'users', userId, 'garments', garmentId);
  await deleteDoc(garmentDocRef);
}