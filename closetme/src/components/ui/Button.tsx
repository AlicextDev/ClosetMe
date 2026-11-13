import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import {
  colors,
  radii,
  retroShadow,
  touchTargets,
  typography,
} from "../../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8, // Efeito pulinho elástico característico dos anos 90
    }).start();
  }

  return (
    <Animated.View
      style={[{ transform: [{ scale: scaleAnim }] }, styles.wrapper, style]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text.primary} size="small" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderRadius: radii.full,
    ...retroShadow.button3D,
  },
  button: {
    minHeight: touchTargets.button,
    backgroundColor: colors.primary.default,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderRetro,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  buttonPressed: {
    backgroundColor: colors.primary.pressed,
  },
  text: {
    ...typography.scale.button,
    fontFamily: typography.fontFamily.button,
    color: colors.text.primary,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
});
