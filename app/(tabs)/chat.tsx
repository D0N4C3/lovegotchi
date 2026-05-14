import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import AppScreen from '@/components/ui/AppScreen';
import { TextField } from '@/components/ui/TextField';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import Colors from '@/constants/colors';
import { useAuth } from '@/providers/AuthProvider';
import { ensureConversation, listenConversation, listenMessages, sendMessage, setTyping } from '@/services/firestore/chatService';
import type { ChatMessage } from '@/types/chat';

export default function ChatScreen(){
  const { profile, relationship } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]); const [text,setText]=useState(''); const [typing,setTypingState]=useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const conversationId = relationship?.id;
  useEffect(()=>{ if(!conversationId || !relationship) return; ensureConversation(conversationId, relationship.members); const u1=listenMessages(conversationId,setMessages); const u2=listenConversation(conversationId,(c)=>setTypingState(!!Object.entries(c?.typing||{}).find(([uid,v])=>uid!==profile?.uid&&v))); return ()=>{u1();u2();};},[conversationId, profile?.uid]);
  const rows = useMemo(()=>messages,[messages]);
  return <AppScreen><Text style={s.title}>Love Chat</Text><FlatList ref={listRef} data={rows} onContentSizeChange={()=>listRef.current?.scrollToEnd({animated:true})} keyExtractor={(i)=>i.id} style={s.list} renderItem={({item})=><View style={[s.bubble, item.senderId===profile?.uid?s.me:s.them]}><Text style={s.msg}>{item.text}</Text></View>} ListEmptyComponent={<Text style={s.empty}>Send your first cozy message 💞</Text>} /><View style={s.composer}><View style={{flex:1}}><TextField value={text} onChangeText={(t)=>{setText(t); if(conversationId && profile) setTyping(conversationId,profile.uid,!!t.trim());}} placeholder='Type a sweet message…' /></View><PrimaryButton label='Send' onPress={async()=>{ if(!conversationId||!profile) return; const t=text; setText(''); await sendMessage(conversationId,profile.uid,t);}} /></View>{typing&&<Text style={s.typing}>Partner is typing…</Text>}</AppScreen>
}
const s=StyleSheet.create({title:{color:Colors.text,fontSize:28,fontWeight:'800',marginBottom:12},list:{flex:1},bubble:{maxWidth:'78%',padding:12,borderRadius:16,marginBottom:8},me:{alignSelf:'flex-end',backgroundColor:'rgba(255,139,123,0.25)'},them:{alignSelf:'flex-start',backgroundColor:Colors.surface},msg:{color:Colors.text},composer:{flexDirection:'row',gap:10,alignItems:'center',paddingTop:8},empty:{color:Colors.textMuted,textAlign:'center',marginTop:30},typing:{color:Colors.textLight,marginTop:6}})
