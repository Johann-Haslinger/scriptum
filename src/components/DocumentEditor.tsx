import { useRef } from "react";
import { useBlockSelectionByKeyPress } from "../hooks/useBlockSelectionByKeyPress";
import { Document } from "../types";
import { BlocksRenderer } from "./blocks-renderer";
import { BlockAreaWrapper } from "./edit-blocks-menu";
import { RubberBandSelector } from "./RubberBandSelector";

const DocumentEditor = ({ document }: { document: Document }) => {
  const { id, name } = document;
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useBlockSelectionByKeyPress();

  return (
    <RubberBandSelector blocksAreaRef={blocksAreaRef}>
      <BlockAreaWrapper>
        <p className="text-3xl font-extrabold mb-6 px-8">{name}</p>
        <BlocksRenderer blocksAreaRef={blocksAreaRef} documentId={id} />
      </BlockAreaWrapper>
    </RubberBandSelector>
  );
};

export default DocumentEditor;
