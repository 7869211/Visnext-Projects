import { QueryClient } from "@tanstack/react-query";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface v0props {
  className?: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const getTimeString = (date: Date | null) => {
  if (!date) return "Today";

  const now = new Date();
  const messageDate = new Date(date);

  if (messageDate.toDateString() === now.toDateString()) {
    return "Today";
  }
  if (
    messageDate.toDateString() ===
    new Date(now.setDate(now.getDate() - 1)).toDateString()
  ) {
    return "Yesterday";
  }
  return "Earlier";
};
