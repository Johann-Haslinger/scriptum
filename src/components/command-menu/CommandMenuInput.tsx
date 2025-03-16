import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useCommandMenuUIStore, useDocumentsStore } from "../../store";

const CommandMenuInput = () => {
  const { searchQuery, setSearchQuery, focusedDocumentId, setIsCommandMenuOpen } = useCommandMenuUIStore();
  const focusedDocumentName = useDocumentsStore((state) => {
    const doc = state.documents.find((doc) => doc.id === focusedDocumentId);
    return doc?.name;
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useInitialFocus(inputRef);

  return (
    <div className="flex pt-6 pb-2 justify-between items-center px-4 xl:px-6 w-full">
      <div className="w-full">
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full outline-none placeholder:text-white/30"
          placeholder="Type a command or search..."
        />
        {focusedDocumentName && searchQuery.length > 0 && (
          <div className="absolute top-[20px] flex line-clamp-1 left-0 px-6">
            <div className="py-1">{searchQuery}</div>
            <div className="opacity-60 bg-white/5 pr-2 rounded-lg py-1">
              {focusedDocumentName.toLocaleLowerCase().startsWith(searchQuery.toLocaleLowerCase()) &&
                focusedDocumentName.slice(searchQuery.length)}
              – Open
            </div>
          </div>
        )}
      </div>
      {searchQuery.length > 0 && (
        <button
          onClick={() => setIsCommandMenuOpen(false)}
          onMouseDown={(e) => e.preventDefault()}
          className="focus:outline-2 cursor-pointer hover:bg-white/30 active:bg-white-10 transition-all outline-blue-500/40 outline-offset-1 bg-white/20 text-black/60 rounded-full p-1 flex justify-between"
        >
          <IoClose />
        </button>
      )}
    </div>
  );
};

export default CommandMenuInput;

const useInitialFocus = (ref: React.RefObject<HTMLInputElement | null>) => {
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);
};
