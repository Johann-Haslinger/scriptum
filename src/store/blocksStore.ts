import { Block } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";

type BlocksStore = {
  blocks: Block[];
  addBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;
  loadBlocksFromSupabase: (supabase: SupabaseClient) => Promise<void>;
  saveBlocksToSupabase: (supabase: SupabaseClient) => Promise<void>;
};

export const useBlocksStore = create<BlocksStore>((set, get) => {
  return {
    blocks: [],
    addBlock: (block: Block) => {
      set((state) => ({ blocks: [...state.blocks, block] }));
    },
    updateBlock: (block: Block) => {
      set((state) => ({
        blocks: state.blocks.map((b) => (b.id === block.id ? block : b)),
      }));
    },
    deleteBlock: (id: string) => {
      set((state) => ({
        blocks: state.blocks.filter((b) => b.id !== id),
      }));
    },
    loadBlocksFromSupabase: async (supabase) => {
      const { data, error } = await supabase.from("blocks").select("*");
      if (error) console.error("Error loading blocks:", error);
      if (data) {
        set({ blocks: data });
      }
    },
    saveBlocksToSupabase: async (supabase) => {
      const blocks = get().blocks;
      await supabase.from("blocks").upsert(blocks);
    },
  };
});
