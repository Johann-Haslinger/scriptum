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

  useEffect(() => {
    updateDocument({ ...document, updatedAt: new Date().toISOString() });
  }, []);
};

const DocumentHeader = ({ document }: { document: Document }) => {
  const { name } = document;
  const { updateDocument } = useDocumentsStore();
  const ref = useRef<HTMLParagraphElement>(null);
  const [currentValue, setCurrentValue] = useState(name || "");

  const isPlaceholderVisible = !currentValue.trim();

  const updateDocumentName = () => {
    if (currentValue.trim() !== name) {
      updateDocument({ ...document, name: currentValue });
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <p
        ref={ref}
        onInput={(e) => setCurrentValue((e.target as HTMLParagraphElement).innerText)}
        onBlur={updateDocumentName}
        contentEditable
        suppressContentEditableWarning
        className={`text-3xl w-full focus:outline-none font-bold relative ${
          isPlaceholderVisible
            ? "before:absolute before:text-gray-400 before:opacity-40 before:pointer-events-none before:content-[attr(data-placeholder)] empty:before:block"
            : ""
        }`}
        data-placeholder="Untitled"
      >
        {name}
      </p>
    </div>
  );
};
