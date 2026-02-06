import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      
      login: (username: string, password: string) => {
        if (username === 'Alaska' && password === 'DubAi@687') {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      },
    }),
    {
      name: 'admin-storage',
    }
  )
);
