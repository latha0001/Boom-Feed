import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateWalletBalance: (newBalance: number) => void;
}

const mockUsers: User[] = [
  {
    id: '1', username: 'demo', email: 'demo@example.com', password: 'password', walletBalance: 500, createdAt: new Date()
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    
    return false;
  },

  register: async (username: string, email: string, password: string) => {

    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      username, email, password, walletBalance: 500, 
      createdAt: new Date()
    };
    
    mockUsers.push(newUser);
    set({ user: newUser, isAuthenticated: true });
    
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateWalletBalance: (newBalance: number) => {
    set(state => {
      if (state.user) {
        return { 
          user: { 
            ...state.user, 
            walletBalance: newBalance 
          } 
        };
      }
      return state;
    });
  }
}));