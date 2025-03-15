import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { useBlocksUIStore } from "../../store";
import { Block } from "../../types";

interface DraggableProps extends PropsWithChildren {
  children: React.ReactNode;
  block: Block;
  isDropTarget: boolean;
}

const Draggable = ({ children, block, isDropTarget }: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transition } = useSortable({ id: block.id });
  const { draggingBlocks } = useBlocksUIStore();
  const [isBlockHovered, setBlockHovered] = useState(false);
  const isDragged = draggingBlocks[block.id];

  const style: React.CSSProperties = {
    opacity: isDragged ? 0.3 : 1,
    transition,
    position: "relative",
    width: "100%",
  };

  return (
    <div
      onMouseEnter={() => setBlockHovered(true)}
      onMouseLeave={() => setBlockHovered(false)}
      className="focus:outline-none w-full pl-6"
      ref={setNodeRef}
      {...attributes}
      aria-describedby="DndDescribedBy-0"
      style={style}
      tabIndex={-1}
    >
      {isDropTarget && !isDragged && (
        <div className="absolute left-6 right-0 top-[-4px] rounded-full h-1 bg-blue-400/50" />
      )}
      <div
        className={`pt-1 absolute left-0 opacity-30 dark:opacity-50 w-6 cursor-grab ${
          isBlockHovered ? "xl:visible" : "invisible"
        } `}
        {...listeners}
      >
        <GripVertical />
      </div>
      {children}
    </div>
  );
};

export default Draggable;
