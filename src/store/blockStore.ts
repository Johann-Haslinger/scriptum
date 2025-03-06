import { Block, BlockType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { create } from "zustand";

type BlockStore = {
  blocks: Block[];
  ydoc: Y.Doc;
  provider: WebrtcProvider | null;
  setProvider: (room: string) => void;
  addBlock: (block: Block) => void;
  updateBlock: (id: string, content: string) => void;
  deleteBlock: (id: string) => void;
  loadBlocksFromSupabase: (supabase: SupabaseClient) => Promise<void>;
  saveBlocksToSupabase: (supabase: SupabaseClient) => Promise<void>;
};
export const useBlockStore = create<BlockStore>((set, get) => {
  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Block>("blocks");

  yArray.observe(() => {
    set({ blocks: yArray.toArray() });
  });

  const initialBlocks: Block[] = [
    {
      id: crypto.randomUUID(),
      type: BlockType.TEXT,
      content: "Hello, World!",
    },
  ];
  yArray.push(initialBlocks);

  return {
    blocks: yArray.toArray(),
    ydoc,
    provider: null,
    setProvider: (room) => {
      const provider = new WebrtcProvider(room, ydoc);
      set({ provider });
    },
    addBlock: (block) => {
      yArray.push([block]);
    },
    updateBlock: (id) => {
      const blocks = yArray.toArray();
      const index = blocks.findIndex((b) => b.id === id);
      if (index !== -1) {
        const block = blocks[index];
        yArray.delete(index, 1);
        yArray.insert(index, [block]);
      }
    },
    deleteBlock: (id) => {
      const blocks = yArray.toArray();
      const index = blocks.findIndex((b) => b.id === id);
      if (index !== -1) {
        yArray.delete(index, 1);
      }
    },
    loadBlocksFromSupabase: async (supabase) => {
      const { data, error } = await supabase.from("blocks").select("*");
      if (error) console.error("Fehler beim Laden:", error);
      if (data) {
        yArray.push(data);
      }
    },
    saveBlocksToSupabase: async (supabase) => {
      const blocks = get().blocks;
      await supabase.from("blocks").upsert(blocks);
    },
  };
});
