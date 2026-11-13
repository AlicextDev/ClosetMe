import { NEUTRAL_COLORS, OCCASION_STYLE_RULES } from "../../../constants";
import type { Garment, GarmentStyle, Occasion } from "../../../types";

export interface RecommendationResult {
  success: boolean;
  garments?: Garment[];
  missing?: string[];
  message?: string;
}

export function generateOutfitRecommendation(
  garments: Garment[],
  occasion: Occasion,
  chosenStyle: GarmentStyle,
): RecommendationResult {
  const allowedStyles = OCCASION_STYLE_RULES[occasion] || [];
  if (!allowedStyles.includes(chosenStyle)) {
    return {
      success: false,
      message: `O estilo escolhido não combina com a ocasião ${occasion}.`,
    };
  }

  const eligibleGarments = garments.filter((g) =>
    g.styles.includes(chosenStyle),
  );

  const tops = eligibleGarments.filter((g) => g.category === "top");
  const bottoms = eligibleGarments.filter((g) => g.category === "bottom");
  const onePieces = eligibleGarments.filter((g) => g.category === "one_piece");
  const shoes = eligibleGarments.filter((g) => g.category === "shoes");
  const accessories = eligibleGarments.filter(
    (g) => g.category === "accessory",
  );

  if (shoes.length === 0) {
    return {
      success: false,
      missing: ["Calçado"],
      message: `Falta cadastrar pelo menos um calçado no estilo ${chosenStyle}.`,
    };
  }

  const hasTopAndBottom = tops.length > 0 && bottoms.length > 0;
  const hasOnePiece = onePieces.length > 0;

  if (!hasTopAndBottom && !hasOnePiece) {
    const missingItems: string[] = [];
    if (tops.length === 0 && onePieces.length === 0)
      missingItems.push("Parte de cima ou Peça inteira");
    if (bottoms.length === 0 && onePieces.length === 0)
      missingItems.push("Parte de baixo");

    return {
      success: false,
      missing: missingItems,
      message: `Faltam peças para montar o look: ${missingItems.join(", ")}.`,
    };
  }

  const selectedShoes = shoes[0];
  const outfitGarments: Garment[] = [];

  if (hasOnePiece) {
    outfitGarments.push(onePieces[0], selectedShoes);
  } else {
    let chosenTop = tops[0];
    let chosenBottom = bottoms[0];

    if (!NEUTRAL_COLORS.includes(chosenTop.color)) {
      const matchingBottom = bottoms.find(
        (b) => b.color === chosenTop.color || NEUTRAL_COLORS.includes(b.color),
      );
      if (matchingBottom) chosenBottom = matchingBottom;
    }

    outfitGarments.push(chosenTop, chosenBottom, selectedShoes);
  }

  if (accessories.length > 0) {
    outfitGarments.push(accessories[0]);
  }

  return {
    success: true,
    garments: outfitGarments,
  };
}
