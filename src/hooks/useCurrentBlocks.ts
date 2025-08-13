import { useBlocksStore } from "../store";
import { useCurrentDocument } from "./useCurrentDocument";

export const useCurrentBlocks = () => {
  const { blocks } = useBlocksStore();
  const { currentDocumentId } = useCurrentDocument();

  return blocks.filter((block) => block.documentId === currentDocumentId).sort((a, b) => a.order - b.order);
};
2;
