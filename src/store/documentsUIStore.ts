import { create } from "zustand";

const STORAGE_KEY_OPEN_DOCS = "openDocumentIds";
const STORAGE_KEY_CURRENT_DOC = "currentDocumentId";

type DocumentsUIStore = {
  openDocumentIds: Record<string, boolean>;
  setDocumentOpen: (documentId: string, value: boolean) => void;
  currentDocumentId: string | null;
  setCurrentDocument: (documentId: string) => void;
  isEditingCurrentDocumentName: boolean;
  setIsEditingCurrentDocumentName: (isEditing: boolean) => void;
};

export const useDocumentsUIStore = create<DocumentsUIStore>((set) => {
  const storedOpenDocumentIds = typeof localStorage !== "undefined" 
    ? JSON.parse(localStorage.getItem(STORAGE_KEY_OPEN_DOCS) || "{}") 
    : {};
  const storedCurrentDocumentId = typeof localStorage !== "undefined" 
    ? localStorage.getItem(STORAGE_KEY_CURRENT_DOC) 
    : null;

  return {
    openDocumentIds: storedOpenDocumentIds,
    setDocumentOpen: (documentId, value) => {
      set((state) => {
        const openDocumentIds = { ...state.openDocumentIds, [documentId]: value };
        localStorage.setItem(STORAGE_KEY_OPEN_DOCS, JSON.stringify(openDocumentIds));
        return { openDocumentIds };
      });
    },
    currentDocumentId: storedCurrentDocumentId,
    setCurrentDocument: (documentId) => {
      set(() => {
        localStorage.setItem(STORAGE_KEY_CURRENT_DOC, documentId);
        return { currentDocumentId: documentId };
      });
    },
    isEditingCurrentDocumentName: false,
    setIsEditingCurrentDocumentName: (isEditing) => {
      set(() => ({ isEditingCurrentDocumentName: isEditing }));
    },
  };
});
