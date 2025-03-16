import { create } from "zustand";

type CommandMenuUIStore = {
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  focusedMenuItem: string | null;
  setFocusedMenuItem: (item: string | null) => void;
};

export const useCommandMenuUIStore = create<CommandMenuUIStore>((set) => ({
  isCommandMenuOpen: false,
  setIsCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
  searchQuery: "",
  setSearchQuery: (value) => set({ searchQuery: value }),
  focusedMenuItem: null,
  setFocusedMenuItem: (item) => set({ focusedMenuItem: item }),
}));
