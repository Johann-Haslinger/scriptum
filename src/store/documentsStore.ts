import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { Document } from "../types";
import { toCamelCase, toSnakeCase } from "../utils";

type DocumentsStore = {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: Document) => void;
  initialize: (userId: string) => Promise<void>;
};

export const useDocumentsStore = create<DocumentsStore>((set) => {
  return {
    documents: [],
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
    initialize: async (userId: string) => {
      console.log("Initializing documents store");
      const { data, error } = await supabaseClient.from("documents").select("*").eq("type", "root").single();

      if (error) console.error("Error fetching root document", error);

      if (!data) {
        const newRootDoc: Document = {
          id: crypto.randomUUID(),
          ownerId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sharedWith: [],
          type: "root",
          name: "Home",
        };

        const { data: newDocument, error: insertError } = await supabaseClient
          .from("documents")
          .insert(toSnakeCase(newRootDoc))
          .single();

        if (insertError) {
          console.error("Error inserting root document", insertError);
          return;
        }

        set({ documents: [newDocument] });
        return;
      }

      if (data) set({ documents: [toCamelCase(data) as Document] });
    },
  };
});
