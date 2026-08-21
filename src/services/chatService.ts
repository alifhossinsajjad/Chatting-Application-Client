import { api } from '@/lib/axios';
import { Conversation, Message, User } from '@/types';

export const chatService = {
  searchUsers: async (q: string): Promise<User[]> => {
    const response = await api.get<any>('/users/search', { params: { q } });
    return Array.isArray(response.data) ? response.data : (response.data.users || response.data.data || []);
  },

  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<any>('/conversations');
    return Array.isArray(response.data) ? response.data : (response.data.conversations || response.data.data || []);
  },

  startDirectConversation: async (userId: string): Promise<Conversation> => {
    const response = await api.post<Conversation>('/conversations', { userId });
    return response.data;
  },

  createGroup: async (name: string, participantIds: string[]): Promise<Conversation> => {
    const response = await api.post<Conversation>('/conversations/group', { name, participantIds });
    return response.data;
  },

  getMessages: async (conversationId: string, limit: number = 20, before?: string): Promise<Message[]> => {
    const response = await api.get<any>(`/conversations/${conversationId}/messages`, {
      params: { limit, before },
    });
    const msgs = Array.isArray(response.data) ? response.data : (response.data.messages || response.data.data || []);
    return [...msgs].reverse();
  },

  sendMessage: async (conversationId: string, text: string): Promise<Message> => {
    const response = await api.post<Message>('/messages', { conversationId, text });
    return response.data;
  },
  
  // Admin Group actions
  addParticipants: async (conversationId: string, userIds: string[]): Promise<void> => {
    await api.post(`/conversations/${conversationId}/participants`, { userIds });
  },

  removeParticipant: async (conversationId: string, userId: string): Promise<void> => {
    await api.delete(`/conversations/${conversationId}/participants/${userId}`);
  },

  promoteToAdmin: async (conversationId: string, userId: string): Promise<void> => {
    await api.post(`/conversations/${conversationId}/admins`, { userId });
  },

  renameGroup: async (conversationId: string, name: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}`, { name });
  },
};
