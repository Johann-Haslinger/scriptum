import { useBlocksStore, useBlocksUIStore } from "@/store";
import BlockComponentMatcher from "./BlockComponentMatcher";
import DragAndDropWrapper from "./DragAndDropWrapper";
import Draggable from "./Draggable";
import LastBlockIndicator from "./LastBlockIndicator";
import OutsideClickWrapper from "./OutsideClickWrapper";

interface BlockRendererProps {
  editorId: string;
  blocksAreaRef: React.RefObject<HTMLDivElement | null>;
}

const BlocksRenderer = ({ blocksAreaRef }: BlockRendererProps) => {
  const { blocks } = useBlocksStore();
  const { dropIndex } = useBlocksUIStore();

  return (
    <div ref={blocksAreaRef}>
      <OutsideClickWrapper>
        <DragAndDropWrapper>
          <div className="space-y-0.5">
            {blocks
              .sort((a, b) => a.order - b.order)
              .map((block, index) => (
                <Draggable key={block.id} block={block} isDropTarget={dropIndex == index}>
                  <BlockComponentMatcher block={block} />
                </Draggable>
              ))}
            <LastBlockIndicator isDropTarget={dropIndex == blocks.length} />
          </div>
        </DragAndDropWrapper>
      </OutsideClickWrapper>
    </div>
  );
};

export default BlocksRenderer;
