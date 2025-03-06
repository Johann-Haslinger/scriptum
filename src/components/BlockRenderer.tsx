import { useBlockStore } from "../store/blockStore";
import { BlockType } from "../types";
import TextBlockComponent from "./blocks/TextBlock";

const BlockRenderer = ({}: { editorId: string }) => {
  const { blocks } = useBlockStore();

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
