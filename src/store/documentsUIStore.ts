import { create } from "zustand";

type DocumentsUIStore = {
  openDocumentIds: Record<string, boolean>;
  setDocumentOpen: (documentId: string, value: boolean) => void;
  currentDocumentId: string;
  setCurrentDocument: (documentId: string) => void;
};

export const useDocumentsUIStore = create<DocumentsUIStore>((set) => {
  return {
    openDocumentIds: {
      "2": true,
      "3": true,
    },
    setDocumentOpen: (documentId, value) => {
      set((state) => {
        const openDocumentIds = { ...state.openDocumentIds };
        openDocumentIds[documentId] = value;
        return { openDocumentIds };
      });
    },
    currentDocumentId: "1",
    setCurrentDocument: (documentId) => {
      set(() => {
        const currentDocumentId = documentId;
        return { currentDocumentId };
      });
    },
  };
});
