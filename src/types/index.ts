export interface User {
  id: string;
  _id: string;
  phone: string;
  name: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  participants: User[];
  admins?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}
