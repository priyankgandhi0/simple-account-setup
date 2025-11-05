import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistrationFormData } from '../types';

interface RegistrationState {
  draft: Partial<RegistrationFormData> | null;
  saveDraft: (data: Partial<RegistrationFormData>) => void;
  clearDraft: () => void;
  getDraft: () => Partial<RegistrationFormData> | null;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      draft: null,

      saveDraft: (data) => {
        set({ draft: { ...get().draft, ...data } });
      },

      clearDraft: () => {
        set({ draft: null });
      },

      getDraft: () => {
        return get().draft;
      },
    }),
    {
      name: 'registration-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);