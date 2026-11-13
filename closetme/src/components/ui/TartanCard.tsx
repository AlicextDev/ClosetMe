import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { colors, radii, retroShadow } from "../../theme";

interface TartanCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TartanCard({ children, style }: TartanCardProps) {
  return (
    <View style={[styles.tartanFrame, style]}>
      <View style={styles.innerSurface}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tartanFrame: {
    backgroundColor: colors.primary.default,
    borderRadius: radii.card,
    padding: 6,
    borderWidth: 1.5,
    borderColor: colors.borderRetro,
    ...retroShadow.soft,
  },
  innerSurface: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
  },
});
