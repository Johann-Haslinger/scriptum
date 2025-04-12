import { Block, SupabaseTable } from "@/types";
import { create } from "zustand";
import supabaseClient from "../lib/supabase";
import { toCamelCase, toSnakeCase } from "../utils";

type BlocksStore = {
  blocks: Block[];
  addBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;
  loadDocumentBlocks: (documentId: string) => Promise<Boolean>;
};

export const useBlocksStore = create<BlocksStore>((set) => {
  return {
    blocks: [],
    addBlock: async (block: Block) => {
      set((state) => ({ blocks: [...state.blocks, block] }));

      const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).insert(toSnakeCase(block));

      if (error) {
        console.error("Error inserting block", error);
        set((state) => ({ blocks: state.blocks.filter((b) => b.id !== block.id) }));
      }
    },
    updateBlock: async (block: Block) => {
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === block.id ? block : b)),
      }));

      const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).update(toSnakeCase(block)).eq("id", block.id);
      if (error) {
        console.error("Error updating block", error);
        return;
      }
    },
    deleteBlock: async (id: string) => {
      set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
      }));

      const { error } = await supabaseClient.from(SupabaseTable.BLOCKS).delete().eq("id", id);
      if (error) {
        console.error("Error deleting block", error);
        return;
      }
    },
    loadDocumentBlocks: async (documentId: string) => {
      const { data, error } = await supabaseClient.from(SupabaseTable.BLOCKS).select("*").eq("document_id", documentId);

      if (error) {
        console.error("Error loading blocks", error);
        return false;
      }

      if (data) {
        const blocks = data.map((b) => toCamelCase(b) as Block);
        set({ blocks: blocks });
      }

      return data.length > 0;
    },
  };
});
