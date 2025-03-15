import { create } from "zustand";
import { EditOptionName } from "../types";

type EditMenuUIStore = {
  currentEditOption: EditOptionName | null;
  setCurrentEditOption: (option: EditOptionName | null) => void;
  focusedEditOption: EditOptionName;
  setFocusedEditOption: (option: EditOptionName) => void;
};

export const useEditMenuUIStore = create<EditMenuUIStore>((set) => {
  return {
    currentEditOption: null,
    setCurrentEditOption: (option) => {
      set({ currentEditOption: option });
    },
    focusedEditOption: EditOptionName.AI,
    setFocusedEditOption: (option) => {
      set({ focusedEditOption: option });
    },
  };
});
