import { closestCenter, DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useBlocksStore, useBlocksUIStore } from "../store";
import BlockComponentMatcher from "./blocks/BlockComponentMatcher";
import { Block } from "../types";

const DragAndDropWrapper = ({ children }: { children: React.ReactNode }) => {
  const { blocks, updateBlock } = useBlocksStore();
  const { selectedBlocks, setDragging, draggingBlocks, setSelected, dropIndex, setDropIndex } = useBlocksUIStore();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  function handleDragStart(event: any) {
    const draggedBlock = blocks.find((b) => b.id === event.active.id);
    if (!draggedBlock) return;
    setSelected(draggedBlock.id, true);
    Object.keys(selectedBlocks).forEach((blockId) => setDragging(blockId, selectedBlocks[blockId]));
    setDragging(draggedBlock.id, true);
  }

  function handleDragOver(event: any) {
    const { over } = event;
    if (!over) return;

    const overIndex = blocks.findIndex((b) => b.id === over.id);
    if (over.id === "last") {
      setDropIndex(blocks.length);
      return;
    }

    setDropIndex(overIndex);
  }

  function handleDragEnd(event: any) {
    const draggedBlock = blocks.find((b) => b.id === event.active.id);

    if (draggedBlock?.order !== blocks[dropIndex]?.order && dropIndex !== -1) {
      const sortedBlocks = blocks.sort((a, b) => a.order - b.order);
      const lower = sortedBlocks[dropIndex - 1]?.order ?? 0;
      const higher = sortedBlocks[dropIndex]?.order ?? sortedBlocks[blocks.length - 1].order + 100;
      const newOrder = (lower + higher) / 2;

      const updatedBlocks = sortedBlocks.map((b) => {
        if (draggingBlocks[b.id]) {
          return { ...b, order: newOrder };
        }
        return b;
      });

      updatedBlocks.forEach((b) => updateBlock(b));
    }

    Object.keys(draggingBlocks).forEach((blockId) => setDragging(blockId, false));
    setDropIndex(-1);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={[...blocks.map((b) => b.id), "last"]}>{children}</SortableContext>
      <DragOverlay>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {blocks
            .filter((b) => draggingBlocks[b.id])
            .map((block) => (
              <GhostBlock key={block.id} block={block} />
            ))}
        </div>
      </DragOverlay>
    </DndContext>
  );
};

export default DragAndDropWrapper;

const GhostBlock = ({ block }: { block: Block }) => {
  return (
    <div className="pl-6">
      <BlockComponentMatcher block={block} />
    </div>
  );
};
