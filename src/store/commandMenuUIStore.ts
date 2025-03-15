import { create } from "zustand";

type CommandMenuUIStore = {
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (isOpen: boolean) => void;
};

export const useCommandMenuUIStore = create<CommandMenuUIStore>((set) => ({
  isCommandMenuOpen: false,
  setIsCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
}));
