export type GarmentCategory =
  | "top"
  | "bottom"
  | "one_piece"
  | "shoes"
  | "accessory";

export type GarmentStyle =
  | "casual"
  | "elegant"
  | "sporty"
  | "minimalist"
  | "creative";

export type Occasion = "work" | "leisure" | "study";

export type GarmentSeason = "summer" | "winter" | "mid_season" | "all_year";

export type GarmentColor =
  | "black"
  | "white"
  | "gray"
  | "blue"
  | "green"
  | "pink";

export interface Garment {
  id: string;
  name: string;
  category: GarmentCategory;
  color: GarmentColor;
  styles: GarmentStyle[];
  season: GarmentSeason;
  photoUrl: string;
  createdAt: number;
}

export interface Outfit {
  id: string;
  occasion: Occasion;
  style: GarmentStyle;
  garmentIds: string[];
  createdAt: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
