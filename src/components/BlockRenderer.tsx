import { useBlockStore } from "../store/blockStore";
import TextBlock from "./blocks/TextBlock";

const BlockRenderer = ({ editorId }: { editorId: string }) => {
  const { blocks } = useBlockStore();

  return (
    <div>
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            <TextBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
