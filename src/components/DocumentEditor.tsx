import { useEffect, useRef } from "react";
import { useDocumentsStore } from "../store";
import { Document } from "../types";
import { BlocksRenderer } from "./blocks-renderer";
import { BlockAreaWrapper } from "./edit-blocks-menu";
import { RubberBandSelector } from "./RubberBandSelector";

const DocumentEditor = ({ document }: { document: Document }) => {
  const { id, name } = document;
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useUpdateDocumentTimestamp(document);

  return (
    <RubberBandSelector blocksAreaRef={blocksAreaRef}>
      <BlockAreaWrapper>
        <p className="text-3xl font-extrabold mb-6 px-8">{name || "Untitled"}</p>
        <BlocksRenderer blocksAreaRef={blocksAreaRef} documentId={id} />
      </BlockAreaWrapper>
    </RubberBandSelector>
  );
};

export default DocumentEditor;

export const useUpdateDocumentTimestamp = (document: Document) => {
  const { updateDocument } = useDocumentsStore();

  useEffect(() => {
    updateDocument({ ...document, updatedAt: new Date().toISOString() });
  }, [document, updateDocument]);
};
