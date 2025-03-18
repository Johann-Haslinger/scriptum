import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { Document, SupabaseTable } from "../types";
import { toCamelCase, toSnakeCase } from "../utils";

type DocumentsStore = {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: Document) => void;
  loadRootDocument: (userId: string) => Promise<void>;
  loadRecentDocuments: () => Promise<void>;
};

export const useDocumentsStore = create<DocumentsStore>((set) => {
  return {
    documents: [],
    addDocument: async (document) => {
      const { error } = await supabaseClient.from(SupabaseTable.DOCUMENTS).insert(toSnakeCase(document));

      if (error) {
        console.error("Error inserting document", error);
        return;
      }

      set((state) => {
        const documents = [...state.documents, document];

        return { documents };
      });
    },
    removeDocument: async (documentId) => {
      const { error } = await supabaseClient.from(SupabaseTable.DOCUMENTS).delete().eq("id", documentId);

      if (error) {
        console.error("Error deleting document", error);
        return;
      }

      set((state) => {
        const documents = state.documents.filter((doc) => doc.id !== documentId);
        return { documents };
      });
    },
    updateDocument: async (document) => {
      console.log("Updating document", document);
      const { error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .update(toSnakeCase(document))
        .eq("id", document.id);

      if (error) {
        console.error("Error updating document", error);
        return;
      }

      set((state) => {
        const documents = state.documents.map((doc) => (doc.id === document.id ? document : doc));
        return { documents };
      });
    },
    loadRootDocument: async (userId: string) => {
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
    loadRecentDocuments: async () => {
      const { data, error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .select("*")
        .gte("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching recent documents", error);
        return;
      }

      if (data) {
        const documents = data.map((doc) => toCamelCase(doc) as Document);
        set({ documents });
      }
    },
  };
});
