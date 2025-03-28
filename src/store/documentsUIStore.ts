import { create } from "zustand";

type DocumentsUIStore = {
  openDocumentIds: Record<string, boolean>;
  setDocumentOpen: (documentId: string, value: boolean) => void;
  currentDocumentId: string | null;
  setCurrentDocument: (documentId: string) => void;
};

export const useDocumentsUIStore = create<DocumentsUIStore>((set) => {
  return {
    openDocumentIds: {},
    setDocumentOpen: (documentId, value) => {
      set((state) => {
        const openDocumentIds = { ...state.openDocumentIds };
        openDocumentIds[documentId] = value;
        return { openDocumentIds };
      });
    },
    currentDocumentId: null,
    setCurrentDocument: (documentId) => {
      set(() => {
        const currentDocumentId = documentId;
        return { currentDocumentId };
      });
    },
  };
});
