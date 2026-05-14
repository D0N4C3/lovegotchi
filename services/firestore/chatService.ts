import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from "@react-native-firebase/firestore";
import { db } from '@/services/firebase/config';
import type { ChatMessage, ConversationDoc } from '@/types/chat';

export const ensureConversation = async (relationshipId: string, memberIds: string[]) => {
  const ref = doc(db, 'conversations', relationshipId);
  await setDoc(ref, { id: relationshipId, relationshipId, memberIds, typing: {}, unread: {} } satisfies ConversationDoc, { merge: true });
  return relationshipId;
};

export const listenConversation = (conversationId: string, cb: (c: ConversationDoc | null) => void) => onSnapshot(doc(db, 'conversations', conversationId), s => cb(s.exists() ? s.data() as ConversationDoc : null));
export const listenMessages = (conversationId: string, cb: (m: ChatMessage[]) => void) => onSnapshot(query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt','asc')), snap => cb(snap.docs.map(d => ({id:d.id,...d.data()}) as ChatMessage)));

export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
  const clean = text.trim(); if(!clean) return;
  await addDoc(collection(db, 'conversations', conversationId, 'messages'), { conversationId, senderId, text: clean, createdAt: new Date().toISOString(), serverCreatedAt: serverTimestamp(), status: 'sent' } satisfies Omit<ChatMessage,'id'> & {serverCreatedAt: any});
  await updateDoc(doc(db, 'conversations', conversationId), { lastMessage: clean, lastMessageAt: new Date().toISOString(), [`typing.${senderId}`]: false });
};

export const setTyping = (conversationId: string, uid: string, isTyping: boolean) => updateDoc(doc(db, 'conversations', conversationId), { [`typing.${uid}`]: isTyping });
