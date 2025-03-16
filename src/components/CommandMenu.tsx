import { compareDesc, format, isToday, isYesterday, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { PropsWithChildren, useEffect, useRef } from "react";
import { IoClose, IoReturnDownBack } from "react-icons/io5";
import { useOutsideClick } from "../hooks";
import { useCommandMenuUIStore, useDocumentsStore, useDocumentsUIStore } from "../store";
import { Document } from "../types";

const CommandMenu = () => {
  const { isCommandMenuOpen, searchQuery } = useCommandMenuUIStore();

  useCommandMenuKeyboardNavigation();
  useDocumentFocus();
  useSearchQueryReset();

  return (
    <div>
      <BackgroundOverlay />
      <AnimatePresence>
        {isCommandMenuOpen && (
          <CommandMenuWrapper>
            <CommandMenuInput />
            {searchQuery.length > 0 ? <ResultsList /> : <RecentDocumentList />}
          </CommandMenuWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandMenu;

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
          className="bg-white/20 text-black/60 rounded-full p-1 flex justify-between"
        >
          <IoClose />
        </button>
      )}
    </div>
  );
};

const useSearchQueryReset = () => {
  const { isCommandMenuOpen, setSearchQuery } = useCommandMenuUIStore();

  useEffect(() => {
    if (!isCommandMenuOpen) setSearchQuery("");
  }, [isCommandMenuOpen, setSearchQuery]);
};

const ResultsList = () => {
  const documents = useSearchResults();

  return (
    <ul className="px-4 mt-2 pb-4 w-full">
      {documents.map((doc) => (
        <DocumentItem key={doc.id} document={doc} />
      ))}
      {documents.length === 0 && <div className="w-full px-3 py-2.5">No results found</div>}
    </ul>
  );
};

const useSearchResults = () => {
  const { searchQuery } = useCommandMenuUIStore();
  const documents = useDocumentsStore((state) => state.documents);

  return documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()));
};

const RecentDocumentList = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const groupedDocs = groupAndSortDocuments(documents);

  return (
    <ul className="px-4 pb-4 w-full">
      {Object.entries(groupedDocs).map(([date, docs]) => (
        <div key={date} className="mt-4">
          <div className="text-sm text-white/30 mb-1 font-semibold">{date}</div>
          <ul>
            {docs.map((doc) => (
              <DocumentItem key={doc.id} document={doc} />
            ))}
          </ul>
        </div>
      ))}
    </ul>
  );
};

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
      className={` ${isFocused && "bg-white/5 rounded-xl"} flex justify-between w-full px-3 pl-4 py-2.5`}
    >
      <p>{searchQuery.length == 0 ? name : highlightedName}</p>
      {isFocused && (
        <div className=" px-4 py-1 rounded-lg bg-white/5  text-white/80">
          <IoReturnDownBack />
        </div>
      )}
    </div>
  );
};

const useCommandMenuKeyboardNavigation = () => {
  const { isCommandMenuOpen, setIsCommandMenuOpen, focusedDocumentId } = useCommandMenuUIStore();
  const { setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        setIsCommandMenuOpen(true);
      }

      if (!isCommandMenuOpen) return;

      if (event.key === "Escape") {
        setIsCommandMenuOpen(false);
      } else if (event.key === "Enter" && focusedDocumentId) {
        setCurrentDocument(focusedDocumentId);
        setDocumentOpen(focusedDocumentId, true);
        setIsCommandMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCommandMenuOpen, setIsCommandMenuOpen, focusedDocumentId, setCurrentDocument]);
};

const BackgroundOverlay = () => {
  const isVisible = useCommandMenuUIStore((state) => state.isCommandMenuOpen);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black z-10"
        />
      )}
    </AnimatePresence>
  );
};

const CommandMenuWrapper = ({ children }: PropsWithChildren) => {
  const commandMenuRef = useRef<HTMLDivElement>(null);
  const { setIsCommandMenuOpen } = useCommandMenuUIStore();

  const commandMenuVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const transition = { type: "spring", duration: 0.4, bounce: 0.15 };

  useOutsideClick(commandMenuRef, () => setIsCommandMenuOpen(false));

  return (
    <motion.div
      ref={commandMenuRef}
      transition={transition}
      variants={commandMenuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute top-1/3 -translate-y-1/3 z-40 left-1/2 -translate-x-1/2 w-1/2 xl:w-2/5 2xl:w-1/3 h-fit bg-white/10 rounded-2xl backdrop-blur-2xl outline outline-white/20 shadow-2xl"
    >
      {children}
    </motion.div>
  );
};

const useInitialFocus = (ref: React.RefObject<HTMLInputElement | null>) => {
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);
};

const groupAndSortDocuments = (documents: Document[]) => {
  const sortedDocs = [...documents].sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)));

  return sortedDocs.reduce<Record<string, Document[]>>((groups, doc) => {
    const date = parseISO(doc.updatedAt);
    let key = format(date, "yyyy-MM-dd");

    if (isToday(date)) key = "Today";
    else if (isYesterday(date)) key = "Yesterday";
    else if (date.getMonth() === new Date().getMonth() - 1) key = "Last 30 days";
    else return groups;

    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);

    return groups;
  }, {});
};

const useDocumentFocus = () => {
  const { focusedDocumentId, setFocusedDocumentId, isCommandMenuOpen } = useCommandMenuUIStore();
  const documents = useVisibleDocuments();

  useEffect(() => {
    if (!isCommandMenuOpen) {
      setFocusedDocumentId(null);
    }
  }, [isCommandMenuOpen, setFocusedDocumentId]);

  useEffect(() => {
    if (!focusedDocumentId && documents.length > 0) {
      setFocusedDocumentId(documents[0].id);
    }
  }, [documents, focusedDocumentId, setFocusedDocumentId]);

  useEffect(() => {
    if (focusedDocumentId && !documents.find((doc) => doc.id === focusedDocumentId)) {
      setFocusedDocumentId(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, focusedDocumentId, setFocusedDocumentId]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      const currentIndex = documents.findIndex((doc) => doc.id === focusedDocumentId);
      const nextIndex = (currentIndex + 1) % documents.length;
      setFocusedDocumentId(documents[nextIndex].id);
    } else if (event.key === "ArrowUp") {
      const currentIndex = documents.findIndex((doc) => doc.id === focusedDocumentId);
      const prevIndex = (currentIndex - 1 + documents.length) % documents.length;
      setFocusedDocumentId(documents[prevIndex].id);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [documents, focusedDocumentId, setFocusedDocumentId]);
};

const useVisibleDocuments = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const { searchQuery } = useCommandMenuUIStore();

  return documents
    .filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      return compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt));
    });
};
