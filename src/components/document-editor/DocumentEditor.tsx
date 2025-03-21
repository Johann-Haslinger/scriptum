import { useEffect, useRef } from "react";
import { useDocumentsStore } from "../../store";
import { Document } from "../../types";
import { BlockAreaWrapper } from "../edit-blocks-menu";
import BlocksRenderer from "./BlocksRenderer";
import DocumentHeader from "./DocumentHeader";
import { RubberBandSelector } from "./RubberBandSelector";

const DocumentEditor = ({ document }: { document: Document }) => {
  const { id } = document;
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useUpdateDocumentTimestamp(document);

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
