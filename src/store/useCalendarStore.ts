import { USER_CALENDARS } from "@/common/endpoints";
import { Calendar } from "@/interfaces";
import apiClient from "@/services/apiClient";
import { create } from "zustand";

interface CalendarStore {
  calendars: Calendar[] | null;
  setCalendars: (value: Calendar[]) => void;
  loading: boolean;
  fetchCalendarData: () => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  calendars: null,
  setCalendars: (value: Calendar[]) => set({ calendars: value }), // Corrected type here
  loading: false,
  fetchCalendarData: async () => {
    try {
      set({ loading: true });
      const response = await apiClient.get(USER_CALENDARS);
      if (Array.isArray(response.data)) {
        set({ calendars: response.data });
      } else {
        console.error("Unexpected response format");
        set({ calendars: null });
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      set({ calendars: null });
    } finally {
      set({ loading: false });
    }
  },
}));
