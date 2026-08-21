import { api } from '@/lib/axios';
import { User } from '@/types';

export interface LoginPayload {
  phone: string;
  name: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
};
