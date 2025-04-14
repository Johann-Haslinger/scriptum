import { useMemo } from "react";
import { useBlocksUIStore } from "../store";
import { useCurrentBlocks } from "./useCurrentBlocks";

export const useSelectedBlocks = () => {
  const { selectedBlockIds } = useBlocksUIStore();
  const blocks = useCurrentBlocks();

  return useMemo(() => {
    return blocks.filter((block) => selectedBlockIds[block.id]).sort((a, b) => a.order - b.order);
  }, [selectedBlockIds, blocks]);
};
