import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { Message } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId, 50),
    enabled: !!conversationId,
  });
}

export function useSendMessage(conversationId: string, onSettledCallback?: () => void) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (text: string) => chatService.sendMessage(conversationId, text),
    onMutate: async (newText) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      const previousMessages = queryClient.getQueryData(['messages', conversationId]);

      const optimisticMsg: Message = {
        id: Math.random().toString(),
        conversationId,
        senderId: user?.id || (user as any)?._id || '',
        text: newText,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ['messages', conversationId],
        (old: Message[] = []) => {
          return [...old, optimisticMsg];
        }
      );

      return { previousMessages };
    },
    onError: (err, newText, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        context?.previousMessages
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (onSettledCallback) onSettledCallback();
    },
  });
}
