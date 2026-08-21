import { useQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chatService';

export function useSearchUsers(searchTerm: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['users', 'search', searchTerm],
    queryFn: () => chatService.searchUsers(searchTerm),
    enabled,
  });
}
