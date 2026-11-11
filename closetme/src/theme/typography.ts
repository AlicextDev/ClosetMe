import type { TextStyle } from "react-native";

export const typography = {
  fontFamily: {
    title: "Unbounded_700Bold",
    body: "Manrope_400Regular",
    bodyBold: "Manrope_700Bold",
    button: "Manrope_700Bold", // <-- adicione esta linha
  },
  scale: {
    display: {
      fontFamily: "Unbounded_700Bold",
      fontSize: 40,
      lineHeight: 48,
    } as TextStyle,
    title1: {
      fontFamily: "Unbounded_700Bold",
      fontSize: 28,
      lineHeight: 36,
    } as TextStyle,
    title2: {
      fontFamily: "Unbounded_700Bold",
      fontSize: 20,
      lineHeight: 28,
    } as TextStyle,
    title3: {
      fontFamily: "Unbounded_700Bold",
      fontSize: 17,
      lineHeight: 24,
    } as TextStyle,
    body: {
      fontFamily: "Manrope_400Regular",
      fontSize: 16,
      lineHeight: 24,
    } as TextStyle,
    small: {
      fontFamily: "Manrope_400Regular",
      fontSize: 14,
      lineHeight: 20,
    } as TextStyle,
    button: {
      fontFamily: "Manrope_700Bold",
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "700",
    } as TextStyle,
    caption: {
      fontFamily: "Manrope_400Regular",
      fontSize: 12,
      lineHeight: 16,
    } as TextStyle,
  },
} as const;
