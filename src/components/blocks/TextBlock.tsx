import { TextBlock } from "@/types";
import BlockWrapper from "./BlockWrapper";

const TextBlockComponent = ({ block }: { block: TextBlock }) => {
  const { content } = block;

  return <BlockWrapper block={block}>{content}</BlockWrapper>;
};

export default TextBlockComponent;
