import { useBlocksStore } from "@/store";
import BlockComponentMatcher from "./blocks/BlockComponentMatcher";
import DragAndDropWrapper from "./DragAndDropWrapper";
import OutsideClickWrapper from "./OutsideClickWrapper";

interface BlockRendererProps {
  editorId: string;
  blocksAreaRef: React.RefObject<HTMLDivElement | null>;
}

const BlocksRenderer = ({ blocksAreaRef }: BlockRendererProps) => {
  const { blocks } = useBlocksStore();

  return (
    <div ref={blocksAreaRef} className="p-4">
      <OutsideClickWrapper>
        <div className="space-y-0.5">
          <DragAndDropWrapper>
            {blocks.map((block, idx) => (
              <BlockComponentMatcher key={block.id} block={block} idx={idx} />
            ))}
          </DragAndDropWrapper>
        </div>
      </OutsideClickWrapper>
    </div>
  );
};

export default BlocksRenderer;
