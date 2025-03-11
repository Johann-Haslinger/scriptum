import { useBlocksStore, useBlocksUIStore } from "@/store";
import { useMemo } from "react";
import BlockComponentMatcher from "./BlockComponentMatcher";
import DragAndDropWrapper from "./DragAndDropWrapper";
import Draggable from "./Draggable";
import LastBlockIndicator from "./LastBlockIndicator";
import OutsideClickWrapper from "./OutsideClickWrapper";

interface BlockRendererProps {
  documentId: string;
  blocksAreaRef: React.RefObject<HTMLDivElement | null>;
}

const BlocksRenderer = ({ blocksAreaRef, documentId }: BlockRendererProps) => {
  const documentBlocks = useDocumentBlocks(documentId);
  const { dropIndex } = useBlocksUIStore();

  return (
    <div ref={blocksAreaRef}>
      <OutsideClickWrapper>
        <DragAndDropWrapper>
          <div className="space-y-0.5">
            {documentBlocks.map((block, index) => (
              <Draggable key={block.id} block={block} isDropTarget={dropIndex == index}>
                <BlockComponentMatcher block={block} />
              </Draggable>
            ))}
            <LastBlockIndicator isDropTarget={dropIndex == documentBlocks.length} />
          </div>
        </DragAndDropWrapper>
      </OutsideClickWrapper>
    </div>
  );
};

export default BlocksRenderer;

const useDocumentBlocks = (documentId: string) => {
  const { blocks } = useBlocksStore();
  const documentBlocks = useMemo(
    () => blocks.filter((block) => block.documentId === documentId).sort((a, b) => a.order - b.order),
    [blocks, documentId]
  );

  return documentBlocks;
};
