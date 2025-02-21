import { create } from 'zustand';

interface AuthStore {
  redirectUrl: string | null;
  setRedirectUrl: (url: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  redirectUrl: null,
  setRedirectUrl: (url) => set({ redirectUrl: url }),
}));
