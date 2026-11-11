import { colors } from "./colors";
import { radii, spacing, touchTargets } from "./spacing";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  spacing,
  radii,
  touchTargets,
} as const;

export type Theme = typeof theme;
export { colors, radii, spacing, touchTargets, typography };

