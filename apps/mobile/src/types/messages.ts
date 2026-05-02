/**
 * NetTapu Messaging types.
 *
 * Backend wire format (assumed; tolerant if endpoints are absent):
 *  GET    /api/v1/messages                 → PaginatedResponse<Conversation>
 *  GET    /api/v1/messages/:conversationId → ConversationDetail
 *  POST   /api/v1/messages                 → { conversationId, parcelId?, body }
 *  POST   /api/v1/messages/:id/read        → 204
 */
export interface Conversation {
  id: string;
  parcelId?: string | null;
  parcelTitle?: string | null;
  parcelImageUrl?: string | null;
  /** masked counter-party name */
  counterpartName: string;
  counterpartRole?: 'consultant' | 'dealer' | 'admin' | 'user' | null;
  /** last message preview */
  preview: string;
  /** ISO date */
  lastMessageAt: string;
  unreadCount: number;
  /** archived = soft-hidden from the inbox */
  archived?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  /** is the message from "me" */
  fromSelf: boolean;
  body: string;
  /** ISO date */
  createdAt: string;
  /** delivery state */
  state: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ConversationDetail {
  conversation: Conversation;
  messages: Message[];
}

export interface SendMessagePayload {
  /** existing conversation; omit when starting one against a parcel */
  conversationId?: string;
  parcelId?: string;
  body: string;
}
