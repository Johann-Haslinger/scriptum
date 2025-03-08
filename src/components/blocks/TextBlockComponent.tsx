import { useBlocksStore } from "@/store";
import { TextBlock } from "@/types";
import BlockWrapper from "./BlockWrapper";

const TextBlockComponent = ({ block }: { block: TextBlock }) => {
  const { content } = block;
  const { updateBlock } = useBlocksStore();

  return (
    <BlockWrapper block={block}>
      <textarea
        className="w-full outline-none"
        onChange={(e) => updateBlock({ ...block, content: e.target.value })}
        value={content}
      />
    </BlockWrapper>
  );
};

export default TextBlockComponent;
