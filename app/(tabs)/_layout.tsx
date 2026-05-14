import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Home, BookHeart, Users, User } from "lucide-react-native";
import Colors from "@/constants/colors";

function TabIcon({ focused, icon: Icon }: { focused: boolean; icon: typeof Home }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Icon
        size={22}
        color={focused ? Colors.primary : Colors.textLight}
        fill={focused ? Colors.primary : "transparent"}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundLight,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingTop: 10,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Home} />,
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: "Memories",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={BookHeart} />,
        }}
      />
      <Tabs.Screen
        name="couple"
        options={{
          title: "Journey",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Users} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  iconContainerActive: {
    backgroundColor: "rgba(255,139,123,0.12)",
  },
});
