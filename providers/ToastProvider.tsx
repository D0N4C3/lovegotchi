import React, { createContext, useContext, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/colors';

const Ctx = createContext({ show: (_msg: string) => {} });
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const [v] = useState(new Animated.Value(0));
  const show = (m: string) => { setMsg(m); Animated.sequence([Animated.timing(v,{toValue:1,duration:180,useNativeDriver:true}), Animated.delay(1800), Animated.timing(v,{toValue:0,duration:180,useNativeDriver:true})]).start(); };
  return <Ctx.Provider value={{show}}>{children}<Animated.View pointerEvents='none' style={[s.toast,{opacity:v, transform:[{translateY:v.interpolate({inputRange:[0,1],outputRange:[30,0]})}]}]}><Text style={s.t}>{msg}</Text></Animated.View></Ctx.Provider>
}
export const useToast = () => useContext(Ctx);
const s=StyleSheet.create({toast:{position:'absolute',left:20,right:20,bottom:30,backgroundColor:Colors.backgroundLight,padding:14,borderRadius:14,borderWidth:1,borderColor:Colors.border},t:{color:Colors.text,textAlign:'center',fontWeight:'700'}})
