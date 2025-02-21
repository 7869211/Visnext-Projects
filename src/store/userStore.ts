import { create } from "zustand";
import apiClient from "@/services/apiClient";

interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  meeting_link: string;
  timezone: string;
  organisations: { role: string; name: string; id: number }[];
  valid_oauth: boolean;
  shown_onboarding: boolean;
}

interface UserStore {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: IUser) => void;
  fetchUserData: () => Promise<void>;
  validateAuth: () => boolean;
  clearAuth: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  setUser: (user: IUser) => set({ user, isAuthenticated: true }),

  fetchUserData: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No access token found");
      }
      const response = await apiClient.get("/users/");
      set({ user: response.data, isAuthenticated: true });
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  validateAuth: () => {
    const token = localStorage.getItem("accessToken");
    const isValid = !!token;
    if (!isValid) {
      set({ user: null, isAuthenticated: false });
    }
    return isValid;
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
}));

export default useUserStore;
