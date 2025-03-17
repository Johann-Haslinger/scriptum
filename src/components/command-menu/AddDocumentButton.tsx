import { CornerDownLeft, Plus } from "lucide-react";
import { useCommandMenuUIStore } from "../../store";

const AddDocumentButton = () => {
  const { focusedMenuItem, setFocusedMenuItem } = useCommandMenuUIStore();
  const isFocused = focusedMenuItem === "new-document";

  return (
    <div
      onMouseEnter={() => setFocusedMenuItem("new-document")}
      className={`${
        isFocused && "bg-white/5 rounded-xl"
      } flex mb-4 cursor-pointer justify-between w-full px-3 mt-2 py-2.5`}
    >
      <div className="flex items-center space-x-2">
        <Plus className="opacity-70" size={18} /> <p>New document</p>
      </div>
      {isFocused && (
        <div className="p-1 text-white/50">
          <CornerDownLeft size={16} />
        </div>
      )}
    </div>
  );
};

export default AddDocumentButton;