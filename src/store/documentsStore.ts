import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { Document, SupabaseTable } from "../types";
import { toCamelCase, toSnakeCase } from "../utils";

interface DocActionResponse {
  data: Document | null;
  error: Error | null;
}

type DocumentsStore = {
  documents: Document[];
  addDocument: (document: Document) => Promise<DocActionResponse>;
  removeDocument: (documentId: string) => void;
  updateDocument: (document: Document) => void;
  loadRootDocument: (userId: string) => Promise<DocActionResponse>;
  loadRecentDocuments: () => Promise<void>;
  loadDocument: (documentId: string) => Promise<DocActionResponse>;
};

export const useDocumentsStore = create<DocumentsStore>((set) => {
  return {
    documents: [],
    addDocument: async (document) => {
      const { error } = await supabaseClient.from(SupabaseTable.DOCUMENTS).insert(toSnakeCase(document));

      if (error) {
        console.error("Error inserting document", error);
        return {
          data: null,
          error: error as Error,
        };
      }

      set((state) => {
        const documents = [...state.documents, document];

        return { documents };
      });

      return {
        data: document,
        error: null,
      } as DocActionResponse;
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
          return {
            data: null,
            error: insertError as Error,
          } as DocActionResponse;
        }

        set({ documents: [newDocument] });
        return {
          data: toCamelCase(newDocument) as Document,
          error: null,
        } as DocActionResponse;
      }

      if (data) set({ documents: [toCamelCase(data) as Document] });

      return {
        data: toCamelCase(data) as Document,
        error: null,
      };
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
        set({ documents: documents.map((doc) => ({ ...doc, name: doc.name || "" })) });
      }
    },
    loadDocument: async (documentId: string) => {
      const { data, error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .select("*")
        .eq("id", documentId)
        .single();

      console.log("fetched  document", data);
      if (error) {
        console.error("Error fetching document", error);
        return { data: null, error: error as Error };
      }

      if (data) {
        set((state) => {
          const existingDocIndex = state.documents.findIndex((doc) => doc.id === documentId);
          let documents;
          if (existingDocIndex !== -1) {
            documents = state.documents.map((doc) => (doc.id === documentId ? (toCamelCase(data) as Document) : doc));
          } else {
            documents = [...state.documents, toCamelCase(data) as Document];
          }
          return { documents };
        });
      }

      return {
        data: toCamelCase(data) as Document,
        error: null,
      };
    },
  };
});
