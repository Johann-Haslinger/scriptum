import { TextBlock } from "@/types";
import BlockWrapper from "./BlockWrapper";

const TextBlockComponent = ({ block, isDropTarget }: { block: TextBlock; isDropTarget: boolean }) => {
  const { content } = block;

  return (
    <BlockWrapper isDropTarget={isDropTarget} block={block}>
      {content}
    </BlockWrapper>
  );
};

export default TextBlockComponent;
