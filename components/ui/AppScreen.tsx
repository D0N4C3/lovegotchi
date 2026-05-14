import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function AppScreen({ children, scroll=false, style }: { children: React.ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const content = scroll ? <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps='handled'>{children}</ScrollView> : <View style={styles.content}>{children}</View>;
  return <SafeAreaView style={[styles.safe, style]} edges={['top','bottom']}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>{content}</KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe:{flex:1, backgroundColor:Colors.background}, flex:{flex:1}, content:{flex:1, padding:20}, scroll:{padding:20, paddingBottom:34} });
