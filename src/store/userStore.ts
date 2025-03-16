import { create } from "zustand";

interface userState {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  userEmail: string | null;
  setUserEmail: (userEmail: string | null) => void;
  isUserLoggedIn: boolean | null;
  setIsUserLoggedIn: (isUserLoggedIn: boolean | null) => void;
}

export const useUserStore = create<userState>((set) => ({
  isUserLoggedIn: null,
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  userId: null,
  setUserId: (userId) => set({ userId }),
  userEmail: null,
  setUserEmail: (userEmail) => set({ userEmail }),
}));
