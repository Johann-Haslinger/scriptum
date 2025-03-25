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
      } flex mb-4 cursor-pointer h-11 justify-between w-full px-3 mt-2 py-2.5`}
    >
      <div className="flex items-center space-x-2">
        <Plus className="opacity-70" size={18} /> <p>New document</p>
      </div>
      {isFocused && (
        <div className="flex text-sm opacity-50 items-center space-x-2 bg-black/20 rounded-lg  py-1 px-4 outline outline-white/10">
          <CornerDownLeft size={14} />
        </div>
      )}
    </div>
  );
};

export default AddDocumentButton;
