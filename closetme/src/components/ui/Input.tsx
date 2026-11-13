import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { colors, radii, spacing, touchTargets, typography } from "../../theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  isPassword = false,
  style,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !!error && styles.inputError]}>
        <TextInput
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={isPassword && !showPassword}
          style={[styles.input, style]}
          {...rest}
        />
        {isPassword && (
          <Pressable
            hitSlop={8}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.text.tertiary}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.scale.button,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: touchTargets.min,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  inputError: {
    borderColor: colors.semantic.error.text,
  },
  input: {
    flex: 1,
    ...typography.scale.body,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    paddingLeft: spacing.sm,
  },
  errorText: {
    ...typography.scale.caption,
    color: colors.semantic.error.text,
    marginTop: spacing.xs,
  },
});
