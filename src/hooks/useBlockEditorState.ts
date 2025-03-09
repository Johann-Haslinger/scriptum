import { useBlocksUIStore } from "../store";
import { BlockEditorState } from "../types/enums";

export const useBlockEditorState = (): BlockEditorState => {
  const { selectedBlocks } = useBlocksUIStore();

  const isSelectingBlocks = Object.values(selectedBlocks).some((isSelected) => isSelected === true);

  return isSelectingBlocks ? BlockEditorState.EDITING_BLOCKS : BlockEditorState.VIEWING;
};
