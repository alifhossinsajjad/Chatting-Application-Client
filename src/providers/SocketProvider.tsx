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

    const socketInstance = io('https://frontend-task-chatapp.onrender.com', {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle incoming messages
    socketInstance.on('message:new', (newMessage: Message) => {
      // Invalidate or update the infinite query for messages
      queryClient.setQueryData(
        ['messages', newMessage.conversationId],
        (oldData: any) => {
          if (!oldData) return oldData;
          // Add the new message to the first page's data (newest first or last depending on our UI design)
          const newPages = [...oldData.pages];
          if (newPages.length > 0) {
            newPages[0] = [newMessage, ...newPages[0]];
          }
          return { ...oldData, pages: newPages };
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
