import { Block, BlockType, SupabaseTable } from "@/types";
import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { toCamelCase, toSnakeCase } from "../utils";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const MOCK_ROOT_DOC_ID = "00000000-0000-0000-0000-000000000001";
const MOCK_OTHER_DOC_ID = "00000000-0000-0000-0000-000000000002";

const MOCK_BLOCKS: Block[] = [
  {
    id: "b-001",
    documentId: MOCK_ROOT_DOC_ID,
    type: BlockType.TEXT,
    order: 1,
    content: "Welcome to Scriptum. This is your Home document.",
  },
  {
    id: "b-002",
    documentId: MOCK_ROOT_DOC_ID,
    type: BlockType.TEXT,
    order: 2,
    content: "Use the command menu (/) to add blocks, or drag to reorder.",
  },
  {
    id: "b-101",
    documentId: MOCK_OTHER_DOC_ID,
    type: BlockType.TEXT,
    order: 1,
    content: "Project Plan",
  },
  {
    id: "b-102",
    documentId: MOCK_OTHER_DOC_ID,
    type: BlockType.TEXT,
    order: 2,
    content: "- Goals\n- Milestones\n- Tasks",
  },
];

interface Response {
  data: Block[] | null;
  error: Error | null;
}

type BlocksStore = {
  blocks: Block[];
  addBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;
  loadDocumentBlocks: (documentId: string) => Promise<Response>;
};

export const useBlocksStore = create<BlocksStore>((set) => {
  return {
    blocks: USE_MOCKS ? MOCK_BLOCKS : [],
    addBlock: async (block: Block) => {
      if (USE_MOCKS) {
        set((state) => ({ blocks: [...state.blocks, block] }));
        return;
      }
      set((state) => ({ blocks: [...state.blocks, block] }));

      const { error } = await supabaseClient
        .from(SupabaseTable.BLOCKS)
        .insert(toSnakeCase(block));

      if (error) {
        console.error("Error inserting block", error);
        set((state) => ({
          blocks: state.blocks.filter((b) => b.id !== block.id),
        }));
      }
    },
    updateBlock: async (block: Block) => {
      if (USE_MOCKS) {
        set((state) => ({
          blocks: state.blocks.map((b) => (b.id === block.id ? block : b)),
        }));
        return;
      }
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === block.id ? block : b)),
      }));

      const { error } = await supabaseClient
        .from(SupabaseTable.BLOCKS)
        .update(toSnakeCase(block))
        .eq("id", block.id);
      if (error) {
        console.error("Error updating block", error);
        return;
      }
    },
    deleteBlock: async (id: string) => {
      if (USE_MOCKS) {
        set((state) => ({ blocks: state.blocks.filter((b) => b.id !== id) }));
        return;
      }
      set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
      }));

      const { error } = await supabaseClient
        .from(SupabaseTable.BLOCKS)
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Error deleting block", error);
        return;
      }
    },
    loadDocumentBlocks: async (documentId: string) => {
      if (USE_MOCKS) {
        const data = MOCK_BLOCKS.filter(
          (b) => b.documentId === documentId
        ).sort((a, b) => a.order - b.order);
        // Merge with existing blocks for other documents
        set((state) => ({
          blocks: [
            ...state.blocks.filter((b) => b.documentId !== documentId),
            ...data,
          ],
        }));
        return { data, error: null } as Response;
      }
      const { data, error } = await supabaseClient
        .from(SupabaseTable.BLOCKS)
        .select("*")
        .eq("document_id", documentId);

      if (error) {
        console.error("Error loading blocks", error);
        return { data: null, error: error };
      }

      if (data) {
        const blocks = data
          .map((b) => toCamelCase(b) as Block)
          .sort((a, b) => a.order - b.order);
        set((state) => ({
          blocks: [
            ...state.blocks.filter((b) => b.documentId !== documentId),
            ...blocks,
          ],
        }));
      }

      return {
        data,
        error: null,
      };
    },
  };
});
