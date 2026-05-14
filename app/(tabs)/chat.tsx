import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TextField } from '@/components/ui/TextField';
import Colors from '@/constants/colors';
import { useAuth } from '@/providers/AuthProvider';
import {
  ensureConversation,
  listenConversation,
  listenMessages,
  sendMessage,
  setTyping,
} from '@/services/firestore/chatService';
import type { ChatMessage } from '@/types/chat';

interface BubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

function Bubble({ message, isMe }: BubbleProps) {
  return (
    <View style={[styles.bubbleWrap, isMe ? styles.bubbleWrapMe : styles.bubbleWrapThem]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        {isMe && (
          <LinearGradient
            colors={['rgba(127,119,221,0.30)', 'rgba(212,83,126,0.20)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        )}
        <Text style={styles.bubbleText}>{message.text}</Text>
      </View>
      {message.timestamp && (
        <Text style={[styles.timestamp, isMe ? styles.timestampMe : styles.timestampThem]}>
          {new Date(message.timestamp?.toDate?.() ?? message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
    </View>
  );
}

export default function ChatScreen() {
  const { profile, relationship } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const conversationId = relationship?.id;

  useEffect(() => {
    if (!conversationId || !relationship) return;

    ensureConversation(conversationId, relationship.members);

    const unsubMessages = listenMessages(conversationId, setMessages);
    const unsubConversation = listenConversation(conversationId, (conv) => {
      const typing = conv?.typing ?? {};
      const partnerIsTyping = Object.entries(typing).some(
        ([uid, active]) => uid !== profile?.uid && active
      );
      setPartnerTyping(partnerIsTyping);
    });

    return () => {
      unsubMessages();
      unsubConversation();
    };
  }, [conversationId, profile?.uid]);

  const rows = useMemo(() => messages, [messages]);

  const handleSend = async () => {
    if (!conversationId || !profile || !text.trim()) return;
    const toSend = text.trim();
    setText('');
    await setTyping(conversationId, profile.uid, false);
    await sendMessage(conversationId, profile.uid, toSend);
  };

  const handleChangeText = (value: string) => {
    setText(value);
    if (conversationId && profile) {
      setTyping(conversationId, profile.uid, !!value.trim());
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Love Chat</Text>
          <View style={styles.onlineDot} />
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={rows}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Bubble message={item} isMe={item.senderId === profile?.uid} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyEmoji}>💞</Text>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.emptyText}>Send your first cozy message to your partner.</Text>
            </View>
          }
        />

        {/* Typing indicator */}
        {partnerTyping && (
          <View style={styles.typingWrap}>
            <View style={styles.typingDots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={styles.typingDot} />
              ))}
            </View>
            <Text style={styles.typingText}>Partner is typing…</Text>
          </View>
        )}

        {/* Composer */}
        <View style={styles.composer}>
          <View style={styles.inputWrap}>
            <TextField
              value={text}
              onChangeText={handleChangeText}
              placeholder="Type a sweet message…"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              blurOnSubmit={false}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!text.trim()}
            style={({ pressed }) => [
              styles.sendButton,
              !text.trim() && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
            ]}
          >
            <LinearGradient
              colors={Colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendGradient}
            >
              <Send size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubbleWrap: {
    marginBottom: 10,
    maxWidth: '78%',
  },
  bubbleWrapMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapThem: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  bubbleMe: {
    backgroundColor: 'rgba(127,119,221,0.15)',
    borderColor: 'rgba(127,119,221,0.30)',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textHint,
    marginTop: 3,
  },
  timestampMe: {
    textAlign: 'right',
    paddingRight: 4,
  },
  timestampThem: {
    paddingLeft: 4,
  },
  typingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 6,
    paddingLeft: 4,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primaryLight,
    opacity: 0.6,
  },
  typingText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingBottom: 16,
  },
  inputWrap: {
    flex: 1,
  },
  sendButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  sendGradient: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
});