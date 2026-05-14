import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Colors from '@/constants/colors';

export function PrimaryButton({ label, onPress, style, disabled }: { label: string; onPress: () => void; style?: ViewStyle; disabled?: boolean }) {
  return <Pressable onPress={onPress} disabled={disabled} style={({pressed}) => [styles.btn, pressed && styles.pressed, disabled && styles.disabled, style]}><Text style={styles.text}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ btn:{backgroundColor:Colors.primary,borderRadius:18,paddingVertical:14,alignItems:'center', shadowColor:Colors.shadow, shadowOpacity:.35, shadowRadius:10,elevation:8}, pressed:{transform:[{scale:.98}]}, disabled:{opacity:.5}, text:{color:Colors.textDark,fontWeight:'700',fontSize:15} });
