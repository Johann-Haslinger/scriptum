import { create } from "zustand";

const STORAGE_SELECTED_BLOCKS = "selectedBlockIds";
const STORAGE_FOCUSED_BLOCK = "focusedBlockId";

type BlocksUIStore = {
  selectedBlockIds: Record<string, boolean>;
  setSelected: (blockId: string, value: boolean) => void;
  draggingBlocks: Record<string, boolean>;
  setDragging: (blockId: string, value: boolean) => void;
  focusedBlockId: string | null;
  setFocused: (blockId: string | null) => void;
  initialFocusedCursorPosition: number | null;
  setInitialFocusedCursorPosition: (position: number | null) => void;
  dropIndex: number;
  setDropIndex: (index: number) => void;
  isRubberBandSelecting: boolean;
  setIsRubberBandSelecting: (value: boolean) => void;
};

export const useBlocksUIStore = create<BlocksUIStore>((set) => {
  const storedSelectedBlockIds =
    typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem(STORAGE_SELECTED_BLOCKS) || "{}") : {};
  const storedFocusedBlockId =
    typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_FOCUSED_BLOCK) || null : null;

  return {
    selectedBlockIds: storedSelectedBlockIds,
    setSelected: (blockId, value) => {
      set((state) => {
        const selectedBlockIds = { ...state.selectedBlockIds, [blockId]: value };
        localStorage.setItem(STORAGE_SELECTED_BLOCKS, JSON.stringify(selectedBlockIds));
        return { selectedBlockIds };
      });
    },
    draggingBlocks: {},
    setDragging: (blockId, value) => {
      set((state) => {
        const draggingBlocks = { ...state.draggingBlocks, [blockId]: value };
        return { draggingBlocks };
      });
    },
    focusedBlockId: storedFocusedBlockId,
    setFocused: (blockId) => {
      set(() => {
        localStorage.setItem(STORAGE_FOCUSED_BLOCK, blockId || "");
        return { focusedBlockId: blockId };
      });
    },
    initialFocusedCursorPosition: null,
    setInitialFocusedCursorPosition: (position) => {
      set(() => {
        return { initialFocusedCursorPosition: position };
      });
    },
    dropIndex: -1,
    setDropIndex: (index) => {
      set(() => {
        return { dropIndex: index };
      });
    },
    isRubberBandSelecting: false,
    setIsRubberBandSelecting: (value) => {
      set(() => {
        return { isRubberBandSelecting: value };
      });
    },
  };
});
