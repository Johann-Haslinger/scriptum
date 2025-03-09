import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSSProperties, PropsWithChildren } from "react";
import { useBlocksStore, useBlocksUIStore } from "../store";
import { Block } from "../types";
import BlockComponentMatcher from "./blocks/BlockComponentMatcher";

const DragAndDropWrapper = ({ children }: PropsWithChildren) => {
  const { blocks, updateBlock } = useBlocksStore();
  const { selectedBlocks, draggingBlocks, setDragging, setDropIndex, dropIndex } = useBlocksUIStore();

  function handleDragStart(event: any) {
    console.log("Drag started", event.active.id);
    const draggedBlock = blocks.find((b) => b.id === event.active.id);
    if (!draggedBlock) return;

    Object.keys(selectedBlocks).forEach((blockId) => {
      console.log("Setting dragging:", blockId);
      setDragging(blockId, selectedBlocks[blockId]);
    });
  }

  function handleDragOver(event: any) {
    const { over } = event;
    if (!over) return;

    const overIndex = blocks.findIndex((b) => b.id === over.id);
    if (over.id === "last" || overIndex === -1) {
      setDropIndex(blocks.length);
      return;
    }

    setDropIndex(overIndex);
  }

  function handleDragEnd(event: any) {
    const { over } = event;
    if (!over) return;

    const activeIndexes = blocks.map((b, i) => (draggingBlocks[b.id] ? i : null)).filter((i) => i !== null) as number[];

    const overIndex = dropIndex ?? blocks.findIndex((b) => b.id === over.id);
    if (activeIndexes.length === 0 || overIndex === -1) return;

    const remainingBlocks = blocks.filter((b) => !draggingBlocks[b.id]);
    const newBlocks = [
      ...remainingBlocks.slice(0, overIndex),
      ...blocks.filter((b) => draggingBlocks[b.id]),
      ...remainingBlocks.slice(overIndex),
    ];

    const updatedBlocks = newBlocks.map((b, i) => ({
      ...b,
      order: (i + 1) * 100,
    }));

    updatedBlocks.forEach((b) => updateBlock(b));
    Object.keys(draggingBlocks).forEach((blockId) => setDragging(blockId, false));
    setDropIndex(null);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={[...blocks.map((b) => b.id), "last"]}>
        {children}

        <LastBlockIndicator isDropTarget={dropIndex == blocks.length} />
      </SortableContext>

      <DragOverlay>
        {draggingBlocks && (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {blocks
              .filter((b) => draggingBlocks[b.id])
              .map((block) => (
                <GhostBlock key={block.id} block={block} />
              ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DragAndDropWrapper;

const LastBlockIndicator = ({ isDropTarget }: { isDropTarget: boolean }) => {
  const { attributes, listeners, setNodeRef, transition } = useSortable({ id: "last" });

  const style: CSSProperties = {
    opacity: 1,
    padding: "10px",
    marginBottom: "5px",
    cursor: "grab",
    transition,
    position: "relative",
  };

  return (
    <div className={`h-20 `} id={"last"} ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {isDropTarget && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "-2px",
            height: "2px",
            background: "blue",
          }}
        />
      )}
    </div>
  );
};

function GhostBlock({ block }: { block: Block }) {
  return (
    <div className="backdrop-blur-3xl">
      <BlockComponentMatcher block={block} idx={0} />
    </div>
  );
}
