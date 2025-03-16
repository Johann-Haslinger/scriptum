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
      name: "Home",
      type: "root",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Beta Blueprint",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Gamma Guide",
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      name: "Delta Design",
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      name: "Epsilon Essay",
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
