/**
 * Messaging API client — thin wrapper over apiClient with graceful 404
 * tolerance so the UI stays functional even when backend endpoints are still
 * being deployed.
 */
import apiClient from './client';
import type {
  Conversation,
  ConversationDetail,
  Message,
  SendMessagePayload,
} from '../types/messages';
import type { PaginatedResponse } from '../types';

export class MessagingUnavailableError extends Error {
  constructor() {
    super('Messaging endpoints are not available on the connected backend.');
    this.name = 'MessagingUnavailableError';
  }
}

function isNotFound(err: any): boolean {
  return err?.response?.status === 404 || err?.response?.status === 501;
}

export async function listConversations(params: { page?: number; limit?: number; archived?: boolean } = {}): Promise<PaginatedResponse<Conversation>> {
  try {
    const { data } = await apiClient.get<PaginatedResponse<Conversation>>('/messages', { params });
    return data;
  } catch (err) {
    if (isNotFound(err)) throw new MessagingUnavailableError();
    throw err;
  }
}

export async function getConversation(conversationId: string): Promise<ConversationDetail> {
  try {
    const { data } = await apiClient.get<ConversationDetail>(`/messages/${conversationId}`);
    return data;
  } catch (err) {
    if (isNotFound(err)) throw new MessagingUnavailableError();
    throw err;
  }
}

export async function sendMessage(payload: SendMessagePayload): Promise<Message> {
  try {
    const { data } = await apiClient.post<Message>('/messages', payload);
    return data;
  } catch (err) {
    if (isNotFound(err)) throw new MessagingUnavailableError();
    throw err;
  }
}

export async function markConversationRead(conversationId: string): Promise<void> {
  try {
    await apiClient.post(`/messages/${conversationId}/read`);
  } catch (err) {
    if (isNotFound(err)) return; // best-effort
    throw err;
  }
}

export async function archiveConversation(conversationId: string): Promise<void> {
  try {
    await apiClient.post(`/messages/${conversationId}/archive`);
  } catch (err) {
    if (isNotFound(err)) throw new MessagingUnavailableError();
    throw err;
  }
}
