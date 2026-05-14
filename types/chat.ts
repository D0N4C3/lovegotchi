export interface ConversationDoc { id: string; relationshipId: string; memberIds: string[]; lastMessage?: string; lastMessageAt?: string; typing?: Record<string, boolean>; unread?: Record<string, number>; }
export interface ChatMessage { id: string; conversationId: string; senderId: string; text: string; createdAt: string; status: 'sending'|'sent'|'read'; }
