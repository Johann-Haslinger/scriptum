import { useSortable } from "@dnd-kit/sortable";
import { useCurrentBlocks } from "../../hooks";
import { useBlocksStore, useBlocksUIStore, useDocumentsUIStore } from "../../store";
import { BlockType } from "../../types";
import { createNewBlock } from "../../utils";

const BlockListEndArea = ({ isDropTarget }: { isDropTarget: boolean }) => {
  const { attributes, setNodeRef } = useSortable({ id: "last" });
  const currentBlocks = useCurrentBlocks();
  const currentDocumentId = useDocumentsUIStore((state) => state.currentDocumentId);
  const { addBlock } = useBlocksStore();
  const { setFocused } = useBlocksUIStore();

  const handleClick = () => {
    const lastBlock = currentBlocks[currentBlocks.length - 1];
    if (lastBlock && lastBlock.type == BlockType.TEXT && lastBlock.content.trim() == "") {
      return;
    } else if (currentDocumentId) {
      const newOrder = currentBlocks.length ? currentBlocks[currentBlocks.length - 1].order + 1 : 1;
      const newBlock = createNewBlock(currentDocumentId);
      addBlock({ ...newBlock, order: newOrder });
      setFocused(newBlock.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="h-20 focus:outline-none relative"
      id={"last"}
      ref={setNodeRef}
      {...attributes}
      tabIndex={-1}
      aria-describedby="DndDescribedBy-0"
    >
      {isDropTarget && <div className="absolute left-6 right-0 top-[-4px] rounded-full h-1 bg-blue-400/50" />}
    </div>
  );
};

export default BlockListEndArea;
