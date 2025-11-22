import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver';
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initAuth: () => Promise<void>;
}

const API_BASE = 'http://localhost:5001/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      token: null,

      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            set({
              isAuthenticated: true,
              currentUser: data.user,
              token: data.token,
            });
            return true;
          } else {
            const error = await response.json();
            console.error('Login failed:', error.message);
            return false;
          }
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        set({ isAuthenticated: false, currentUser: null, token: null });
      },

      initAuth: async () => {
        const { token } = get();

        if (token) {
          try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              set({
                isAuthenticated: true,
                currentUser: data.user,
              });
            } else {
              // Token is invalid, clear auth state
              set({ isAuthenticated: false, currentUser: null, token: null });
            }
          } catch (error) {
            console.error('Token verification error:', error);
            set({ isAuthenticated: false, currentUser: null, token: null });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
