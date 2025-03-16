import { CornerDownLeft, File } from "lucide-react";
import { useEffect, useState } from "react";
import { useCommandMenuUIStore, useDocumentsUIStore } from "../../store";
import { Document } from "../../types";

const DocumentItem = ({ document }: { document: Document }) => {
  const { name, id } = document;
  const {
    searchQuery,
    focusedMenuItem: focusedDocumentId,
    setFocusedMenuItem,
    setIsCommandMenuOpen,
  } = useCommandMenuUIStore();
  const hasMouseMoved = useHasMouseMoved();
  const { setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const isFocused = focusedDocumentId === id;

  const openDocument = () => {
    setCurrentDocument(id);
    setDocumentOpen(id, true);
    setIsCommandMenuOpen(false);
  };

  const highlightedName = name.split(new RegExp(`(${searchQuery})`, "gi")).map((part, index) => (
    <span key={index} style={{ opacity: part.toLowerCase() === searchQuery.toLowerCase() ? "inherit" : "0.5" }}>
      {part}
    </span>
  ));

  return (
    <div
      onClick={openDocument}
      onMouseEnter={() => {
        if (hasMouseMoved) setFocusedMenuItem(id);
      }}
      className={`${isFocused && "bg-white/5 rounded-xl"} flex cursor-pointer justify-between w-full px-3 py-2.5`}
    >
      <div className="flex items-center space-x-3">
        <File className="opacity-80" size={18} />
        <p>{searchQuery.length == 0 ? name || "Untitled" : highlightedName}</p>
      </div>
      {isFocused && (
        <div className="p-1 text-white/80">
          <CornerDownLeft size={16} />
        </div>
      )}
    </div>
  );
};

export default DocumentItem;

const useHasMouseMoved = () => {
  const { isCommandMenuOpen } = useCommandMenuUIStore();
  const [hasMouseMoved, setHasMouseMoved] = useState(false);

  useEffect(() => {
    if (isCommandMenuOpen) {
      setHasMouseMoved(false);

      const handleMouseMove = () => setHasMouseMoved(true);
      window.addEventListener("mousemove", handleMouseMove);

      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isCommandMenuOpen]);

  return hasMouseMoved;
};
