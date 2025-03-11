import { useBlocksStore } from "../store";
import { useDocumentsStore } from "../store/documentsStore";

export const useCurrentBlocks = () => {
  const { blocks } = useBlocksStore();
  const { currentDocumentId } = useDocumentsStore();

  return blocks.filter((block) => block.documentId === currentDocumentId).sort((a, b) => a.order - b.order);
};
