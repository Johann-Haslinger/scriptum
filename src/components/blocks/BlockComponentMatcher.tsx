import { TextBlockComponent } from ".";
import { useBlocksUIStore } from "../../store";
import { Block, BlockType } from "../../types";

interface BlockComponentMatcherProps {
  block: Block;
  idx: number;
}

const BlockComponentMatcher = ({ block, idx }: BlockComponentMatcherProps) => {
  const dropIndex = useBlocksUIStore((state) => state.dropIndex);

  switch (block.type) {
    case BlockType.TEXT:
      return <TextBlockComponent isDropTarget={idx == dropIndex} key={idx} block={block} />;
    default:
      return null;
  }
};

export default BlockComponentMatcher;
