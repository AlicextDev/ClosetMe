import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors, typography } from "../../../theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.default,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...typography.scale.caption,
          fontFamily: typography.fontFamily.button,
        },
      }}
    >
      <Tabs.Screen
        name="wardrobe"
        options={{
          title: "Guarda-roupa",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hanger"
              size={size}
              color={color as any}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="looks"
        options={{
          title: "Looks",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="creation"
              size={size}
              color={color as any}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={size}
              color={color as any}
            />
          ),
        }}
      />
    </Tabs>
  );
}
