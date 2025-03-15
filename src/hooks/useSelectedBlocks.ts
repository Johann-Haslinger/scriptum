import { useBlocksStore, useBlocksUIStore } from "../store";

export const useSelectedBlocks = () => {
  const { selectedBlockIds } = useBlocksUIStore();
  const { blocks } = useBlocksStore();

  return blocks.filter((block) => selectedBlockIds[block.id]);
};
