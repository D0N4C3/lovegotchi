import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Colors from '@/constants/colors';

export function TextField(props: TextInputProps){
  return <View style={styles.wrap}><TextInput placeholderTextColor={Colors.textLight} {...props} style={[styles.input, props.style]} /></View>
}
const styles=StyleSheet.create({wrap:{borderRadius:16,borderWidth:1,borderColor:Colors.border, backgroundColor:Colors.surface, paddingHorizontal:14}, input:{color:Colors.text,paddingVertical:13,fontSize:15}})
