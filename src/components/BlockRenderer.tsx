import { useBlocksStore } from "@/store";
import { BlockType } from "@/types";
import { TextBlockComponent } from "./blocks";
import OutsideClickWrapper from "./OutsideClickWrapper";

const BlockRenderer = ({}: { editorId: string }) => {
  const { blocks } = useBlocksStore();

  return (
    <OutsideClickWrapper>
      {blocks.map((block) => {
        switch (block.type) {
          case BlockType.TEXT:
            return <TextBlockComponent key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </OutsideClickWrapper>
  );
};

export default BlockRenderer;
