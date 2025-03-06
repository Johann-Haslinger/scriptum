import BlockWrapper from "./BlockWrapper";

const TextBlock = ({ block }: { block: TextBlock }) => {
  const { content } = block;

  return <BlockWrapper block={block}>{content}</BlockWrapper>;
};

export default TextBlock;
