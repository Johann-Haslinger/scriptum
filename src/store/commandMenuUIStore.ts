import { create } from "zustand";

type CommandMenuUIStore = {
  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  focusedDocumentId: string | null;
  setFocusedDocumentId: (id: string | null) => void;
};

export const useCommandMenuUIStore = create<CommandMenuUIStore>((set) => ({
  isCommandMenuOpen: false,
  setIsCommandMenuOpen: (isOpen) => set({ isCommandMenuOpen: isOpen }),
  searchQuery: "",
  setSearchQuery: (value) => set({ searchQuery: value }),
  focusedDocumentId: null,
  setFocusedDocumentId: (id) => set({ focusedDocumentId: id }),
}));
