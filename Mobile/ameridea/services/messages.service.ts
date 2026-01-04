import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Conversation, Message } from '../types/messages';

export const messagesService = {
  async getAllConversations(): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(API_ENDPOINTS.CONVERSATIONS);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return apiClient.get<Message[]>(
      API_ENDPOINTS.CONVERSATION_MESSAGES(conversationId)
    );
  },

  async createConversation(title: string, initialMessage?: string): Promise<Conversation> {
    return apiClient.post<Conversation>(API_ENDPOINTS.CONVERSATIONS, {
      title,
      initialMessage,
    });
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    return apiClient.post<Message>(
      API_ENDPOINTS.SEND_MESSAGE(conversationId),
      { text }
    );
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.put(API_ENDPOINTS.MARK_READ(conversationId));
  },
};
