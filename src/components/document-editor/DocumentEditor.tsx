import { useEffect, useRef } from "react";
import { useBlocksStore, useBlocksUIStore, useDocumentsStore } from "../../store";
import { Document, TextBlock } from "../../types";
import { createNewBlock } from "../../utils";
import { BlockAreaWrapper } from "../edit-blocks-menu";
import BlocksRenderer from "./BlocksRenderer";
import DocumentHeader from "./DocumentHeader";
import { RubberBandSelector } from "./RubberBandSelector";

const DocumentEditor = ({ document }: { document: Document }) => {
  const { id } = document;
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useUpdateDocumentTimestamp(document);
  useFetchDocumentBlocks(id);

  return (
    <RubberBandSelector blocksAreaRef={blocksAreaRef}>
      <BlockAreaWrapper ref={blocksAreaRef}>
        <DocumentHeader document={document} />
        <BlocksRenderer documentId={id} />
      </BlockAreaWrapper>
    </RubberBandSelector>
  );
};

export default DocumentEditor;

const useFetchDocumentBlocks = (documentId: string) => {
  const { loadDocumentBlocks } = useBlocksStore();
  const hasFetchedBlocks = useRef(false);
  const { addBlock } = useBlocksStore();
  const { setFocused } = useBlocksUIStore();

  useEffect(() => {
    const fetchBlocks = async () => {
      if (hasFetchedBlocks.current) return;
      const hasDocumentBlocks = await loadDocumentBlocks(documentId);

      if (!hasDocumentBlocks) {
        const block = createNewBlock(documentId);
        addBlock({ ...block, order: 1, content: "" } as TextBlock);
        setFocused(block.id);
      }

      hasFetchedBlocks.current = true;
    };

    fetchBlocks();
  }, [documentId, loadDocumentBlocks]);
};

export const useUpdateDocumentTimestamp = (document: Document) => {
  const { updateDocument } = useDocumentsStore();
  const hasUpdated = useRef(false);

  useEffect(() => {
    if (!hasUpdated.current) {
      updateDocument({ ...document, updatedAt: new Date().toISOString() });
      hasUpdated.current = true;
    }
  }, [document, updateDocument, hasUpdated]);
};
