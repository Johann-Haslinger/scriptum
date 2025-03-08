import { useBlocksStore } from "@/store";
import { BlockType } from "@/types";
import { TextBlockComponent } from "./blocks";
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
          {blocks.map((block, idx) => {
            switch (block.type) {
              case BlockType.TEXT:
                return <TextBlockComponent key={idx} block={block} />;
              default:
                return null;
            }
          })}
        </div>
      </OutsideClickWrapper>
    </div>
  );
};

export default BlocksRenderer;
