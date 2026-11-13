import {
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts,
} from "@expo-google-fonts/fredoka";
import {
  Manrope_400Regular,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider } from "../features/auth/context/AuthContext";
import { colors } from "../theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Manrope_400Regular,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.text.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Slot />
    </AuthProvider>
  );
}
