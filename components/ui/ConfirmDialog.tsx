import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import { PrimaryButton } from './PrimaryButton';

export function ConfirmDialog({ visible, title, message, confirmLabel='Confirm', onCancel, onConfirm }: any){
  if(!visible) return null;
  return <Modal transparent animationType='fade' visible={visible}><Pressable style={s.backdrop} onPress={onCancel}><Pressable style={s.card}><Text style={s.title}>{title}</Text><Text style={s.msg}>{message}</Text><View style={s.row}><PrimaryButton label='Cancel' onPress={onCancel} style={s.ghost as any} /><PrimaryButton label={confirmLabel} onPress={onConfirm} /></View></Pressable></Pressable></Modal>
}
const s=StyleSheet.create({backdrop:{flex:1,backgroundColor:'rgba(0,0,0,.55)',justifyContent:'center',padding:20},card:{backgroundColor:Colors.backgroundLight,borderRadius:22,padding:18,gap:10,borderWidth:1,borderColor:Colors.border},title:{color:Colors.text,fontWeight:'800',fontSize:20},msg:{color:Colors.textMuted},row:{flexDirection:'row',gap:10},ghost:{flex:1,backgroundColor:Colors.surface},});
