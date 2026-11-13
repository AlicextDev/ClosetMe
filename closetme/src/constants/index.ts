import type {
    GarmentCategory,
    GarmentColor,
    GarmentSeason,
    GarmentStyle,
    Occasion,
} from "../types";

export const CATEGORIES: { id: GarmentCategory; label: string }[] = [
  { id: "top", label: "Parte de cima" },
  { id: "bottom", label: "Parte de baixo" },
  { id: "one_piece", label: "Peça inteira" },
  { id: "shoes", label: "Calçado" },
  { id: "accessory", label: "Acessório" },
];

export const STYLES: { id: GarmentStyle; label: string }[] = [
  { id: "casual", label: "Casual" },
  { id: "elegant", label: "Elegante" },
  { id: "sporty", label: "Esportivo" },
  { id: "minimalist", label: "Minimalista" },
  { id: "creative", label: "Criativo" },
];

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "work", label: "Trabalho" },
  { id: "leisure", label: "Passeio" },
  { id: "study", label: "Estudo" },
];

export const SEASONS: { id: GarmentSeason; label: string }[] = [
  { id: "summer", label: "Verão" },
  { id: "winter", label: "Inverno" },
  { id: "mid_season", label: "Meia-estação" },
  { id: "all_year", label: "Todo ano" },
];

export const COLORS: { id: GarmentColor; label: string; hex: string }[] = [
  { id: "black", label: "Preta", hex: "#1C1C1E" },
  { id: "white", label: "Branca", hex: "#FFFFFF" },
  { id: "gray", label: "Cinza", hex: "#8E8E93" },
  { id: "blue", label: "Azul", hex: "#2F80ED" },
  { id: "green", label: "Verde", hex: "#27AE60" },
  { id: "pink", label: "Rosa", hex: "#E75480" },
];

// Proposta inicial de combinação de estilos por ocasião
export const OCCASION_STYLE_RULES: Record<Occasion, GarmentStyle[]> = {
  work: ["casual", "elegant", "minimalist"],
  leisure: ["casual", "sporty", "creative"],
  study: ["casual", "minimalist", "sporty"],
};

export const NEUTRAL_COLORS: GarmentColor[] = ["black", "white", "gray"];
