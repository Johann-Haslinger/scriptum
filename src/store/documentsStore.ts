import { create } from "zustand";
import { Document } from "../types";

type DocumentsStore = {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: Document) => void;
};

export const useDocumentsStore = create<DocumentsStore>((set) => {
  const initialDocuments: Document[] = [
    {
      id: "1",
      name: "Document 1",
      type: "root",
    },
    {
      id: "2",
      name: "Document 2",
    },
    {
      id: "3",
      name: "Document 3",
    },
  ];
  return {
    documents: initialDocuments,
    addDocument: (document) => {
      set((state) => {
        const documents = [...state.documents, document];
        return { documents };
      });
    },
    removeDocument: (documentId) => {
      set((state) => {
        const documents = state.documents.filter((doc) => doc.id !== documentId);
        return { documents };
      });
    },
    updateDocument: (document) => {
      set((state) => {
        const documents = state.documents.map((doc) => (doc.id === document.id ? document : doc));
        return { documents };
      });
    },
  };
});
