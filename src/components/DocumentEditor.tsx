import { useEffect, useRef, useState } from "react";
import { useDocumentsStore } from "../store";
import { Document } from "../types";
import { BlocksRenderer } from "./blocks-renderer";
import { BlockAreaWrapper } from "./edit-blocks-menu";
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

const DocumentHeader = ({ document }: { document: Document }) => {
  const { name, type } = document;
  const { updateDocument } = useDocumentsStore();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [currentValue, setCurrentValue] = useState(name || "");
  const isRootDocument = type === "root";

  const updateDocumentName = () => {
    if (currentValue.trim() && currentValue.trim() !== name) {
      updateDocument({ ...document, name: currentValue.trim() });
    }
  };

  useInitialFocus(ref, !currentValue.trim());

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <textarea
        ref={ref}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={updateDocumentName}
        className={`text-3xl font-bold bg-transparent placeholder:text-white/30 resize-none w-full outline-none ${
          isRootDocument && "cursor-text"
        }`}
        placeholder="Untitled"
        disabled={isRootDocument}
      />
    </div>
  );
};

const useInitialFocus = (ref: React.RefObject<HTMLTextAreaElement | null>, isActive: boolean) => {
  useEffect(() => {
    if (ref.current && isActive) {
      ref.current.focus();
    }
  }, [isActive, ref]);
};
