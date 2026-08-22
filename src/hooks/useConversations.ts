import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';
import { Conversation } from '@/types';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, participantIds }: { name: string; participantIds: string[] }) =>
      chatService.createGroup(name, participantIds),
    onSuccess: (newConv) => {
      queryClient.setQueryData(['conversations'], (old: any) => {
        const oldArray = Array.isArray(old) ? old : [];
        return [newConv, ...oldArray.filter((c: any) => c.id !== newConv.id)];
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useStartDirectConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => chatService.startDirectConversation(userId),
    onSuccess: (newConv) => {
      queryClient.setQueryData(['conversations'], (old: any) => {
        const oldArray = Array.isArray(old) ? old : [];
        return [newConv, ...oldArray.filter((c: any) => c.id !== newConv.id)];
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useAddParticipants(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userIds: string[]) => chatService.addParticipants(conversationId, userIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useRemoveParticipant(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => chatService.removeParticipant(conversationId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function usePromoteToAdmin(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => chatService.promoteToAdmin(conversationId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations'] }),
  });
}
