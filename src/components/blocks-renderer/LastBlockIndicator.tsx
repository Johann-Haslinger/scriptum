import { useSortable } from "@dnd-kit/sortable";

const LastBlockIndicator = ({ isDropTarget }: { isDropTarget: boolean }) => {
  const { attributes, setNodeRef } = useSortable({ id: "last" });

  return (
    <div className="h-8 relative" id={"last"} ref={setNodeRef} {...attributes}>
      {isDropTarget && <div className="absolute left-6 right-0 top-[-4px] rounded-full h-1 bg-blue-400/50" />}
    </div>
  );
};

export default LastBlockIndicator;
