import { useCallback, useEffect, useState } from "react";
import type { Garment, GarmentCategory } from "../../../types";
import { useAuth } from "../../auth/hooks/useAuth";
import {
    listGarments,
    deleteGarment as removeGarmentService,
} from "../services/garmentService";

export function useGarments() {
  const { user } = useAuth();
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<
    GarmentCategory | "all"
  >("all");

  const fetchGarments = useCallback(async () => {
    if (!user) {
      setGarments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await listGarments(user.uid, selectedCategory);
      setGarments(data);
    } catch {
      // Ignora erro se Firebase ainda não estiver com chaves ativas
      setGarments([]);
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory]);

  useEffect(() => {
    fetchGarments();
  }, [fetchGarments]);

  async function deleteGarment(garmentId: string) {
    if (!user) return;
    await removeGarmentService(user.uid, garmentId);
    setGarments((prev) => prev.filter((item) => item.id !== garmentId));
  }

  return {
    garments,
    loading,
    selectedCategory,
    setSelectedCategory,
    refreshGarments: fetchGarments,
    deleteGarment,
  };
}
