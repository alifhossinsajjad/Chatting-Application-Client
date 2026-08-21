'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { useQueryClient } from '@tanstack/react-query';
import { Message, Conversation } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'https://frontend-task-chatapp.onrender.com', {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('message:new', (rawMessage: any) => {
      // Map backend fields to frontend interface since WebSockets bypass Axios interceptors
      const newMessage: Message = {
        ...rawMessage,
        id: rawMessage.id || rawMessage._id,
        conversationId: rawMessage.conversationId || rawMessage.conversation,
        senderId: rawMessage.senderId || rawMessage.sender,
      };

      // Update the standard query for messages
      queryClient.setQueryData(
        ['messages', newMessage.conversationId],
        (oldData: Message[] | undefined) => {
          if (!oldData) return oldData;
          // Prevent duplicates from optimistic updates if ID matches
          const exists = oldData.some(m => m.id === newMessage.id);
          if (exists) return oldData;
          return [...oldData, newMessage];
        }
      );
      
      // Update the conversation list to show latest activity
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    // Handle group updates
    socketInstance.on('conversation:updated', (updatedConv: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
