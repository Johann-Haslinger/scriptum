import { useEffect, useRef, useState } from "react";
import { useBlocksStore, useBlocksUIStore, useDocumentsStore } from "../store";
import { Document, TextBlock } from "../types";
import { createNewBlock } from "../utils";
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
  const { addBlock, blocks } = useBlocksStore();
  const { setFocused } = useBlocksUIStore();

  const updateDocumentName = () => {
    if (currentValue.trim() && currentValue.trim() !== name) {
      updateDocument({ ...document, name: currentValue.trim() });
    }
  };

  useInitialFocus(ref, !currentValue.trim());

  const handleEnterClick = () => {
    ref.current?.blur();
    const block = createNewBlock(document.id);
    const minOrder = blocks.reduce((min, block) => (block.order < min ? block.order : min), 0) - 1;
    addBlock({ ...block, order: minOrder || 1, content: "Ich bin ein Block" } as TextBlock);
    setFocused(block.id);
  };

  const resizeTextarea = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [currentValue]);

  return (
    <div className="flex items-center justify-between pr-4 p-8 py-4">
      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleEnterClick();
          }
        }}
        ref={ref}
        value={currentValue}
        onChange={(e) => {
          setCurrentValue(e.target.value);
          resizeTextarea();
        }}
        onBlur={updateDocumentName}
        className={`text-3xl font-bold bg-transparent placeholder:text-white/30 resize-none w-full outline-none ${
          isRootDocument && "cursor-text"
        }`}
        placeholder="Untitled"
        disabled={isRootDocument}
        rows={1}
        style={{ overflow: "hidden" }}
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
