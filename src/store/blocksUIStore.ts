import { create } from "zustand";

const STORAGE_SELECTED_BLOCKS = "selectedBlockIds";
const STORAGE_FOCUSED_BLOCK = "focusedBlockId";
const STORAGE_DROP_INDEX = "dropIndex";
const STORAGE_IS_RUBBER_BAND_SELECTING = "isRubberBandSelecting";

type BlocksUIStore = {
  selectedBlockIds: Record<string, boolean>;
  setSelected: (blockId: string, value: boolean) => void;
  draggingBlocks: Record<string, boolean>;
  setDragging: (blockId: string, value: boolean) => void;
  focusedBlockId: string | null;
  setFocused: (blockId: string | null) => void;
  dropIndex: number;
  setDropIndex: (index: number) => void;
  isRubberBandSelecting: boolean;
  setIsRubberBandSelecting: (value: boolean) => void;
};

export const useBlocksUIStore = create<BlocksUIStore>((set) => {
  const storedSelectedBlockIds = typeof localStorage !== "undefined"
    ? JSON.parse(localStorage.getItem(STORAGE_SELECTED_BLOCKS) || "{}")
    : {};
  const storedFocusedBlockId = typeof localStorage !== "undefined"
    ? localStorage.getItem(STORAGE_FOCUSED_BLOCK) || null
    : null;
  const storedDropIndex = typeof localStorage !== "undefined"
    ? parseInt(localStorage.getItem(STORAGE_DROP_INDEX) || "-1", 10)
    : -1;
  const storedIsRubberBandSelecting = typeof localStorage !== "undefined"
    ? localStorage.getItem(STORAGE_IS_RUBBER_BAND_SELECTING) === "true"
    : false;

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
    dropIndex: storedDropIndex,
    setDropIndex: (index) => {
      set(() => {
        localStorage.setItem(STORAGE_DROP_INDEX, index.toString());
        return { dropIndex: index };
      });
    },
    isRubberBandSelecting: storedIsRubberBandSelecting,
    setIsRubberBandSelecting: (value) => {
      set(() => {
        localStorage.setItem(STORAGE_IS_RUBBER_BAND_SELECTING, value.toString());
        return { isRubberBandSelecting: value };
      });
    },
  };
});
