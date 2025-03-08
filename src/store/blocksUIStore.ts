import { create } from "zustand";

type BlocksUIStore = {
  selectedBlocks: Record<string, boolean>;
  setSelected: (blockId: string, value: boolean) => void;
  focusedBlockId: string;
  setFocused: (blockId: string) => void;
};

export const useBlocksUIStore = create<BlocksUIStore>((set) => {
  return {
    selectedBlocks: {},
    setSelected: (blockId, value) => {
      set((state) => {
        const selectedBlocks = { ...state.selectedBlocks };
        selectedBlocks[blockId] = value
        return { selectedBlocks: selectedBlocks };
      });
    },
    focusedBlockId: "",
    setFocused: (blockId) => {
      set(() => {
        const focusedBlockId = blockId;
        return { focusedBlockId };
      });
    },
  };
});
