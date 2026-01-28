import { create } from 'zustand';

interface User {
  _id?: string;
  username: string;
  accountname: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, token: null });
  },
}));