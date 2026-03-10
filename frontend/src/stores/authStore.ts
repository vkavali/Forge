import { create } from 'zustand';
import { getAuth, setAuth, clearAuth } from '../lib/auth';

interface AuthState {
  token: string | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  login: (token: string, userId: string, email: string, name: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null, userId: null, email: null, name: null, isAuthenticated: false,
  login: (token, userId, email, name) => {
    setAuth(token, userId, email, name);
    set({ token, userId, email, name, isAuthenticated: true });
  },
  logout: () => { clearAuth(); set({ token: null, userId: null, email: null, name: null, isAuthenticated: false }); },
  hydrate: () => {
    const auth = getAuth();
    if (auth) set({ token: auth.token, userId: auth.userId, email: auth.email, name: auth.name, isAuthenticated: true });
  },
}));
