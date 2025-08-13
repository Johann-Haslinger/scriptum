import { create } from "zustand";

type DocumentsUIStore = {
  isEditingCurrentDocumentName: boolean;
  setIsEditingCurrentDocumentName: (isEditing: boolean) => void;
};

export const useDocumentsUIStore = create<DocumentsUIStore>((set) => {
  return {
    isEditingCurrentDocumentName: false,
    setIsEditingCurrentDocumentName: (isEditing) => {
      set(() => ({ isEditingCurrentDocumentName: isEditing }));
    },
  };
});
