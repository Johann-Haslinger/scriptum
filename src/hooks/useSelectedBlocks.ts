import { useBlocksStore, useBlocksUIStore } from "../store";
import { useMemo } from "react";

export const useSelectedBlocks = () => {
  const { selectedBlockIds } = useBlocksUIStore();
  const { blocks } = useBlocksStore();

  return useMemo(() => {
    const selectedSet = new Set(Object.keys(selectedBlockIds));
    return blocks
      .filter((block) => selectedSet.has(block.id))
      .sort((a, b) => a.order - b.order);
  }, [selectedBlockIds, blocks]);
};
