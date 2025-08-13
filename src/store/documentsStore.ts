import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { Document, SupabaseTable } from "../types";
import { toCamelCase, toSnakeCase } from "../utils";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const MOCK_ROOT_DOC_ID = "00000000-0000-0000-0000-000000000001";
const MOCK_OTHER_DOC_ID = "00000000-0000-0000-0000-000000000002";

const nowIso = () => new Date().toISOString();

const MOCK_DOCUMENTS: Document[] = [
  {
    id: MOCK_ROOT_DOC_ID,
    ownerId: "mock-user",
    name: "Home",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    sharedWith: [],
    type: "root",
  },
  {
    id: MOCK_OTHER_DOC_ID,
    ownerId: "mock-user",
    name: "Project Plan",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    sharedWith: [],
  },
];

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
    documents: USE_MOCKS ? MOCK_DOCUMENTS : [],
    addDocument: async (document) => {
      if (USE_MOCKS) {
        set((state) => ({ documents: [...state.documents, document] }));
        return {
          data: document,
          error: null,
        } as DocActionResponse;
      }
      const { error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .insert(toSnakeCase(document));

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
      if (USE_MOCKS) {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== documentId),
        }));
        return;
      }
      const { error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .delete()
        .eq("id", documentId);

      if (error) {
        console.error("Error deleting document", error);
        return;
      }

      set((state) => {
        const documents = state.documents.filter(
          (doc) => doc.id !== documentId
        );
        return { documents };
      });
    },
    updateDocument: async (document) => {
      if (USE_MOCKS) {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === document.id ? document : doc
          ),
        }));
        return;
      }
      const { error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .update(toSnakeCase(document))
        .eq("id", document.id);

      if (error) {
        console.error("Error updating document", error);
        return;
      }

      set((state) => {
        const documents = state.documents.map((doc) =>
          doc.id === document.id ? document : doc
        );
        return { documents };
      });
    },
    loadRootDocument: async (userId: string) => {
      if (USE_MOCKS) {
        const root = MOCK_DOCUMENTS.find((d) => d.type === "root")!;
        set({
          documents: [root, ...MOCK_DOCUMENTS.filter((d) => d.id !== root.id)],
        });
        return {
          data: root,
          error: null,
        } as DocActionResponse;
      }
      const { data, error } = await supabaseClient
        .from("documents")
        .select("*")
        .eq("type", "root")
        .single();

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
      if (USE_MOCKS) {
        set({ documents: MOCK_DOCUMENTS });
        return;
      }
      const { data, error } = await supabaseClient
        .from(SupabaseTable.DOCUMENTS)
        .select("*")
        .gte(
          "updated_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching recent documents", error);
        return;
      }

      if (data) {
        const documents = data.map((doc) => toCamelCase(doc) as Document);
        console.log("fetched recent documents", documents);
        set({
          documents: documents.map((doc) => ({ ...doc, name: doc.name || "" })),
        });
      }
    },
    loadDocument: async (documentId: string) => {
      if (USE_MOCKS) {
        const doc = MOCK_DOCUMENTS.find((d) => d.id === documentId) || null;
        if (doc) {
          set((state) => {
            const existingDocIndex = state.documents.findIndex(
              (d) => d.id === documentId
            );
            const documents =
              existingDocIndex !== -1
                ? state.documents.map((d) => (d.id === documentId ? doc : d))
                : [...state.documents, doc];
            return { documents };
          });
        }
        return {
          data: doc,
          error: null,
        } as DocActionResponse;
      }
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
          const existingDocIndex = state.documents.findIndex(
            (doc) => doc.id === documentId
          );
          let documents;
          if (existingDocIndex !== -1) {
            documents = state.documents.map((doc) =>
              doc.id === documentId ? (toCamelCase(data) as Document) : doc
            );
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
