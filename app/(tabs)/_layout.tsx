import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Home, BookHeart, Users, User, MessageCircleHeart } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

function TabIcon({ focused, icon: Icon }: { focused: boolean; icon: typeof Home }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      {focused && <LinearGradient colors={[Colors.primaryGlow, 'rgba(255,255,255,0.04)']} style={StyleSheet.absoluteFill} />}
      <Icon size={20} color={focused ? Colors.accent : Colors.textLight} strokeWidth={focused ? 2.6 : 2.1} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['rgba(33,22,56,0.95)', 'rgba(22,14,38,0.88)']} style={StyleSheet.absoluteFill} />
          </View>
        ),
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textLight,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Nest', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Home} /> }} />
      <Tabs.Screen name="memories" options={{ title: 'Memories', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={BookHeart} /> }} />
      <Tabs.Screen name="chat" options={{ title: 'Whispers', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={MessageCircleHeart} /> }} />
      <Tabs.Screen name="couple" options={{ title: 'Journey', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Users} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'You', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 92,
    paddingBottom: 26,
    paddingTop: 12,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  iconContainer: {
    width: 42,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconContainerActive: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
