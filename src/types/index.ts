export interface User {
  id: string;
  _id: string;
  phone: string;
  name: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  type?: string;
  name?: string;
  participants: User[];
  admins?: string[];
  lastMessage?: {
    text: string;
    sender: string;
    createdAt: string;
  };
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
