import { create } from "zustand";

type BlocksUIStore = {
  selectedBlocks: Record<string, boolean>;
  setSelected: (blockId: string, value: boolean) => void;
  draggingBlocks: Record<string, boolean>;
  setDragging: (blockId: string, value: boolean) => void;
  focusedBlockId: string;
  setFocused: (blockId: string) => void;
  dropIndex: number;
  setDropIndex: (index: number) => void;
  isRubberBandSelecting: boolean;
  setIsRubberBandSelecting: (value: boolean) => void;
};

export const useBlocksUIStore = create<BlocksUIStore>((set) => {
  return {
    selectedBlocks: {},
    setSelected: (blockId, value) => {
      set((state) => {
        const selectedBlocks = { ...state.selectedBlocks };
        selectedBlocks[blockId] = value;
        return { selectedBlocks: selectedBlocks };
      });
    },
    draggingBlocks: {},
    setDragging: (blockId, value) => {
      set((state) => {
        const draggingBlocks = { ...state.draggingBlocks };
        draggingBlocks[blockId] = value;
        return { draggingBlocks };
      });
    },
    focusedBlockId: "",
    setFocused: (blockId) => {
      set(() => {
        const focusedBlockId = blockId;
        return { focusedBlockId };
      });
    },
    dropIndex: -1,
    setDropIndex: (index) => {
      set(() => {
        const dropIndex = index;
        return { dropIndex };
      });
    },
    isRubberBandSelecting: false,
    setIsRubberBandSelecting: (value) => {
      set(() => {
        const isRubberBandSelecting = value;
        return { isRubberBandSelecting };
      });
    },
  };
});
