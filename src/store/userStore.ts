import { create } from "zustand";

interface userState {
  userId: string;
  setUserId: (userId: string) => void;
  userEmail: string | null;
  setUserEmail: (userEmail: string | null) => void;
  isUserLoggedIn: boolean | null;
  setIsUserLoggedIn: (isUserLoggedIn: boolean | null) => void;
}

export const useUserStore = create<userState>((set) => ({
  isUserLoggedIn: null,
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  userId: "",
  setUserId: (userId) => set({ userId }),
  userEmail: null,
  setUserEmail: (userEmail) => set({ userEmail }),
}));
