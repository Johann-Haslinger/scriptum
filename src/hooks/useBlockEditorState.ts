import { useBlocksUIStore } from "../store";
import { BlockEditorState } from "../types/enums";

export const useBlockEditorState = (): BlockEditorState => {
  const { selectedBlockIds: selectedBlocks, draggingBlocks } = useBlocksUIStore();

  const isSelectingBlocks = Object.values(selectedBlocks).some((isSelected) => isSelected === true);
  const isDraggingBlocks = Object.values(draggingBlocks).some((isDragging) => isDragging === true);

  return isDraggingBlocks
    ? BlockEditorState.DRAGGING_BLOCKS
    : isSelectingBlocks
    ? BlockEditorState.EDITING_BLOCKS
    : BlockEditorState.VIEWING;
};
