import { create } from "zustand";

type BlocksUIStore = {
  selectedBlockIds: Record<string, boolean>;
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
    selectedBlockIds: {},
    setSelected: (blockId, value) => {
      set((state) => {
        const selectedBlockIds = { ...state.selectedBlockIds };
        selectedBlockIds[blockId] = value;
        return { selectedBlockIds };
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
