import { Block, BlockType } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { create } from "zustand";

type BlocksStore = {
  blocks: Block[];
  ydoc: Y.Doc;
  provider: WebrtcProvider | null;
  setProvider: (room: string) => void;
  addBlock: (block: Block) => void;
  updateBlock: (block: Block) => void;
  deleteBlock: (id: string) => void;
  loadBlocksFromSupabase: (supabase: SupabaseClient) => Promise<void>;
  saveBlocksToSupabase: (supabase: SupabaseClient) => Promise<void>;
};

export const useBlocksStore = create<BlocksStore>((set, get) => {
  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Block>("blocks");

  yArray.observe(() => {
    set({ blocks: yArray.toArray() });
  });

  const initialBlocks: Block[] = [
    {
      id: "1",
      type: BlockType.TEXT,
      content: "Hello, World!",
      order: 100,
    },
    {
      id: "2",
      type: BlockType.TEXT,
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      order: 200,
    },
    {
      id: "3",
      type: BlockType.TEXT,
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
      order: 300,
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
    addBlock: (block: Block) => {
      yArray.push([block]);
    },
    updateBlock: (block: Block) => {
      const blocks = yArray.toArray();
      const index = blocks.findIndex((b) => b.id === block.id);
      if (index !== -1) {
        console.log("updateBlock", block);
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
