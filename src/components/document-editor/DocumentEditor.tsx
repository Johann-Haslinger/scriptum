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
  useAddEmptyBlock(document);

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

const useAddEmptyBlock = (document: Document) => {
  const { id: documentId, name } = document;
  const { addBlock, blocks } = useBlocksStore();
  const { setFocused } = useBlocksUIStore();
  const documentBlocks = blocks.filter((block) => block.documentId === documentId);
  const hasAddedBlock = useRef(false);

  useEffect(() => {
    if (documentBlocks.length === 0 && !hasAddedBlock.current && name.trim() !== "") {
      const block = createNewBlock(documentId);
      addBlock({ ...block, order: 1, content: "Ich bin ein Block" } as TextBlock);
      setFocused(block.id);
      hasAddedBlock.current = true;
    }
  }, [documentBlocks.length, documentId, addBlock, setFocused, name]);
};
