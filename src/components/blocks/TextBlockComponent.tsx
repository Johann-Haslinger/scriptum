import { TextBlock } from "@/types";
import BlockContentEditor from "./BlockContentEditor";
import BlockWrapper from "./BlockWrapper";

const TextBlockComponent = ({ block }: { block: TextBlock }) => {
  return (
    <BlockWrapper block={block}>
      <BlockContentEditor block={block} />
    </BlockWrapper>
  );
};

export default TextBlockComponent;
