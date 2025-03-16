import { IoReturnDownBack } from "react-icons/io5";
import { useCommandMenuUIStore, useDocumentsUIStore } from "../../store";
import { Document } from "../../types";

const DocumentItem = ({ document }: { document: Document }) => {
  const { name, id } = document;
  const { searchQuery, focusedDocumentId, setFocusedDocumentId, setIsCommandMenuOpen } = useCommandMenuUIStore();
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
      onMouseEnter={() => setFocusedDocumentId(id)}
      className={`${isFocused && "bg-white/5 rounded-xl"} flex justify-between w-full px-3 pl-4 py-2.5`}
    >
      <p>{searchQuery.length == 0 ? name : highlightedName}</p>
      {isFocused && (
        <div className="px-4 py-1 rounded-lg text-white/80">
          <IoReturnDownBack />
        </div>
      )}
    </div>
  );
};

export default DocumentItem;
