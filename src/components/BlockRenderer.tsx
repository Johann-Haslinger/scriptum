import { useBlocksStore } from "@/store";
import { BlockType } from "../types/enums";
import { TextBlockComponent } from "./blocks";

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
