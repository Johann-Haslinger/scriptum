import { useBlocksUIStore } from "../store";
import { BlockEditorState } from "../types/enums";

export const useBlockEditorState = (): BlockEditorState => {
  const { selectedBlockIds, draggingBlocks } = useBlocksUIStore();

  const isSelectingBlocks = Object.values(selectedBlockIds).some((isSelected) => isSelected === true);
  const isDraggingBlocks = Object.values(draggingBlocks).some((isDragging) => isDragging === true);

  return isDraggingBlocks
    ? BlockEditorState.DRAGGING_BLOCKS
    : isSelectingBlocks
    ? BlockEditorState.EDITING_BLOCKS
    : BlockEditorState.VIEWING;
};
