import { useRef } from "react";
import { useBlockSelectionByKeyPress } from "../hooks/useBlockSelectionByKeyPress";
import { BlocksRenderer } from "./blocks-renderer";
import { BlockAreaWrapper } from "./edit-blocks-menu";
import { RubberBandSelector } from "./RubberBandSelector";

const DocumentPage = ({ documentId }: { documentId: string }) => {
  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useBlockSelectionByKeyPress();

  return (
    <RubberBandSelector blocksAreaRef={blocksAreaRef}>
      <BlockAreaWrapper>
        <p className="text-4xl font-extrabold mb-6 px-8">Block Editor</p>
        <BlocksRenderer blocksAreaRef={blocksAreaRef} documentId={documentId} />
      </BlockAreaWrapper>
    </RubberBandSelector>
  );
};

export default DocumentPage;
