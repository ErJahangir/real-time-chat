import { create } from "zustand";
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chart-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
