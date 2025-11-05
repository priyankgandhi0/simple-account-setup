import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveCredentials,
  getCredentials,
  deleteCredentials,
  saveSessionToken,
  getSessionToken,
  deleteSessionToken,
} from '../utils/secureStorage';
import { User } from '../types';
import { STORAGE_KEYS, MAX_LOGIN_ATTEMPTS, ERROR_MESSAGES } from '../utils/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  failedLoginAttempts: number;
  isAccountLocked: boolean;
  lockTime: number | null;

  register: (userData: Omit<User, 'id'>, password: string) => Promise<boolean>;
  login: (
    emailOrUsername: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  resetFailedAttempts: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  failedLoginAttempts: 0,
  isAccountLocked: false,
  lockTime: null, // To added lock time

  register: async (userData, password) => {
    try {
      const userId = `user_${Date.now()}`;
      const user: User = { ...userData, id: userId };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      await saveCredentials(userData.email, password);

      const sessionToken = `session_${Date.now()}_${userId}`;
      await saveSessionToken(sessionToken);

      set({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  },

  login: async (emailOrUsername, password) => {
    const state = get();

    // If locked, check unlock time
    if (state.isAccountLocked && state.lockTime) {
      const twoMinutes = 2 * 60 * 1000;
      if (Date.now() - state.lockTime >= twoMinutes) {
        // Auto unlock
        set({ isAccountLocked: false, failedLoginAttempts: 0, lockTime: null });
      } else {
        return { success: false, error: ERROR_MESSAGES.ACCOUNT_LOCKED };
      }
    }

    try {
      const credentials = await getCredentials();
      if (!credentials) {
        const newAttempts = state.failedLoginAttempts + 1;
        const isLocked = newAttempts >= MAX_LOGIN_ATTEMPTS;

        set({
          failedLoginAttempts: newAttempts,
          isAccountLocked: isLocked,
          lockTime: isLocked ? Date.now() : null, // lock time stored
        });

        return {
          success: false,
          error: isLocked ? ERROR_MESSAGES.ACCOUNT_LOCKED : ERROR_MESSAGES.LOGIN_FAILED,
        };
      }

      if (
        credentials.username === emailOrUsername &&
        credentials.password === password
      ) {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (userData) {
          const user: User = JSON.parse(userData);

          const sessionToken = `session_${Date.now()}_${user.id}`;
          await saveSessionToken(sessionToken);

          set({
            user,
            isAuthenticated: true,
            failedLoginAttempts: 0,
            isAccountLocked: false,
            lockTime: null,
          });

          return { success: true };
        }
      }

      // wrong password
      const newAttempts = state.failedLoginAttempts + 1;
      const isLocked = newAttempts >= MAX_LOGIN_ATTEMPTS;

      set({
        failedLoginAttempts: newAttempts,
        isAccountLocked: isLocked,
        lockTime: isLocked ? Date.now() : null,
      });

      return {
        success: false,
        error: isLocked ? ERROR_MESSAGES.ACCOUNT_LOCKED : ERROR_MESSAGES.LOGIN_FAILED,
      };

    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: ERROR_MESSAGES.LOGIN_FAILED };
    }
  },

  logout: async () => {
    try {
      await deleteSessionToken();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  checkSession: async () => {
    try {
      set({ isLoading: true });

      const { isAccountLocked, lockTime } = get();

      // Auto unlock when time completed
      if (isAccountLocked && lockTime) {
        const twoMinutes = 2 * 60 * 1000;
        if (Date.now() - lockTime >= twoMinutes) {
          set({ isAccountLocked: false, failedLoginAttempts: 0, lockTime: null });
        }
      }

      const sessionToken = await getSessionToken();
      if (sessionToken) {
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (userData) {
          const user: User = JSON.parse(userData);
          set({ user, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Session check failed:', error);
      set({ isLoading: false });
    }
  },

  resetFailedAttempts: () => {
    set({ failedLoginAttempts: 0, isAccountLocked: false, lockTime: null });
  },
}));
