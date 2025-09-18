import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const mockUsers = [
  {
    id: 1,
    email: 'manager@realestate.com',
    password: 'manager123',
    role: 'manager',
    name: 'John Manager',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  },
  {
    id: 2,
    email: 'staff@realestate.com',
    password: 'staff123',
    role: 'staff',
    name: 'Sarah Staff',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150'
  }
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          set({ 
            user: { ...user, password: undefined }, 
            isLoading: false 
          });
          return { success: true };
        } else {
          set({ 
            error: 'Invalid credentials', 
            isLoading: false 
          });
          return { success: false, error: 'Invalid credentials' };
        }
      },
      
      logout: () => {
        set({ user: null, error: null });
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);