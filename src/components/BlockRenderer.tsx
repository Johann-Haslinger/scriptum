import { useBlocksStore } from "../store/blocksStore";
import { BlockType } from "../types";
import TextBlockComponent from "./blocks/TextBlock";

const BlockRenderer = ({}: { editorId: string }) => {
  const { blocks } = useBlocksStore();

  return (
    <div>
      {blocks.map((block) => {
        switch (block.type) {
          case BlockType.TEXT:
            return <TextBlockComponent key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
