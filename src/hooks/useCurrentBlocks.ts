import { useBlocksStore, useDocumentsUIStore } from "../store";

export const useCurrentBlocks = () => {
  const { blocks } = useBlocksStore();
  const { currentDocumentId } = useDocumentsUIStore();

  return blocks.filter((block) => block.documentId === currentDocumentId).sort((a, b) => a.order - b.order);
};
