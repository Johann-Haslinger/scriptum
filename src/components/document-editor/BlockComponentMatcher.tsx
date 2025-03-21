import { Block, BlockType } from "../../types";
import { TextBlockComponent } from "../blocks";

interface BlockComponentMatcherProps {
  block: Block;
}

const BlockComponentMatcher = ({ block }: BlockComponentMatcherProps) => {
  switch (block.type) {
    case BlockType.TEXT:
      return <TextBlockComponent block={block} />;
    default:
      return null;
  }
};

export default BlockComponentMatcher;
