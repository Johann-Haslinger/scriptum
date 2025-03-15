import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoAdd, IoClose, IoHome } from "react-icons/io5";
import { useBlockEditorState } from "../hooks";
import { useDocumentsStore, useDocumentsUIStore } from "../store";
import { BlockEditorState, Document } from "../types";
import { Tooltip } from "./tooltip";

const DocumentsTabBar = () => {
  const openDocuments = useOpenDocuments();
  const isVisible = useBlockEditorState() === BlockEditorState.VIEWING;

  return (
    <motion.div
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      className="fixed select-none z-[200] flex top-4 w-fit left-1/2 transform -translate-x-1/2"
    >
      <RootDocumentTab />
      {openDocuments.length > 0 && (
        <div className="flex ml-2 space-x-2">
          {openDocuments.map((doc, idx) => (
            <DocumentTab index={idx} document={doc} key={doc.id} />
          ))}
        </div>
      )}
      <AddTabButton />
    </motion.div>
  );
};

export default DocumentsTabBar;

const RootDocumentTab = () => {
  const { isRootDocumentCurrent, rootDocumentId } = useRootDocument();
  const { setCurrentDocument } = useDocumentsUIStore();
  const [isHovered, setIsHovered] = useState(false);
  const isHomeTextVisible = isHovered || isRootDocumentCurrent;

  const openRootDocument = () => setCurrentDocument(rootDocumentId);

  const homeTextVariants = {
    hidden: { opacity: 0, width: 0, marginLeft: 0 },
    visible: { opacity: 1, width: 48, marginLeft: 8 },
  };

  return (
    <div>
      <motion.div
        onKeyDown={(e) => {
          if (e.key === "Enter") openRootDocument();
        }}
        tabIndex={3}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={openRootDocument}
        onMouseDown={(e) => e.preventDefault()}
        data-tooltip-id="open-root-document"
        className={`${
          isRootDocumentCurrent
            ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white/80"
            : "bg-black/5 dark:bg-white/[0.07] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/40"
        } overflow-hidden h-9 focus:outline-2 outline-blue-500/40 outline-offset-1 flex rounded-full py-1 items-center px-3`}
      >
        <IoHome />
        <AnimatePresence>
          {isHomeTextVisible && (
            <motion.div
              variants={homeTextVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="font-medium ml-2"
            >
              Home
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const DocumentTab = ({ document, index }: { document: Document; index: number }) => {
  const { id, name } = document;
  const { currentDocumentId, setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const { rootDocumentId } = useRootDocument();
  const isCurrent = currentDocumentId === id;
  const [isHovered, setIsHovered] = useState(false);
  const isCloseIconVisible = isHovered || isCurrent;

  const setDocumentCurrent = () => setCurrentDocument(id);
  const closeDocument = () => {
    if (isCurrent) setCurrentDocument(rootDocumentId);
    setDocumentOpen(id, false);
  };

  useDocumentsNavigation();

  const closeButtonVariants = {
    hidden: { opacity: 0, width: 0, marginRight: 0 },
    visible: { opacity: 1, width: 16, marginRight: 8 },
  };

  return (
    <div>
      <motion.div
        onKeyDown={(e) => {
          if (e.key === "Enter") setDocumentCurrent();
        }}
        tabIndex={3 + index * 2}
        onClick={setDocumentCurrent}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`flex focus:outline-2 focus:outline-blue-500/40 outline-offset-1 items-center active:opacity-50 transition-all rounded-full pr-4 py-1
      ${isCloseIconVisible ? "pl-2" : "pl-4"}
      ${
        isCurrent
          ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white/80"
          : "bg-black/5 dark:bg-white/[0.07] dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/40"
      }`}
      >
        <AnimatePresence>
          {isCloseIconVisible && (
            <div>
              <motion.button
                data-tooltip-id="close-document"
                tabIndex={4 + index * 2}
                onClick={(e) => {
                  e.stopPropagation();
                  closeDocument();
                }}
                variants={closeButtonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={{
                  scale: 1.1,
                }}
                className="bg-black/30 focus:outline-2 outline-blue-500/40 outline-offset-1 dark:bg-white/15 hover:bg-black/60 dark:hover:bg-white/40 cursor-pointer size-4 flex justify-center items-center text-sm rounded-full text-white/80 dark:text-black/70"
              >
                <IoClose />
              </motion.button>
              <Tooltip place="bottom" id="close-document">
                Close document
              </Tooltip>
            </div>
          )}
        </AnimatePresence>
        <p className="font-medium">{name}</p>
      </motion.div>
    </div>
  );
};

const AddTabButton = () => {
  const openCommandMenu = () => console.log("Open command menu");

  return (
    <div>
      <motion.button
        onMouseDown={(e) => e.preventDefault()}
        onClick={openCommandMenu}
        data-tooltip-id="open-new-document"
        className="p-2 rounded-lg ml-2 focus:outline-2 focus:bg-blue-500/20  outline-blue-500/40 outline-offset-1 opacity-60 active:opacity-40 hover:opacity-100 transition-all text-xl cursor-pointer"
      >
        <IoAdd />
      </motion.button>
      <Tooltip place="right" id="open-new-document">
        Open new document
      </Tooltip>
    </div>
  );
};

const useOpenDocuments = () => {
  const openDocumentIds = useDocumentsUIStore((state) => state.openDocumentIds);
  const documents = useDocumentsStore((state) => state.documents);

  return documents.filter((doc) => openDocumentIds[doc.id]);
};

const useRootDocument = () => {
  const documents = useDocumentsStore((state) => state.documents);
  const currentDocumentId = useDocumentsUIStore((state) => state.currentDocumentId);
  const rootDocument = documents.find((doc) => doc.type === "root");

  const isRootDocumentCurrent = rootDocument?.id === currentDocumentId;

  return {
    rootDocumentId: rootDocument?.id || "",
    isRootDocumentCurrent,
  };
};

const useDocumentsNavigation = () => {
  const { currentDocumentId, setCurrentDocument } = useDocumentsUIStore();
  const openDocuments = useOpenDocuments();
  const { rootDocumentId, isRootDocumentCurrent } = useRootDocument();
  const blockEditorState = useBlockEditorState();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (blockEditorState !== BlockEditorState.VIEWING) return;

      if (e.key === "Escape" && currentDocumentId !== rootDocumentId) {
        setCurrentDocument(rootDocumentId);
      }

      if (e.metaKey && e.key === "1") {
        setCurrentDocument(rootDocumentId);
      }

      openDocuments.forEach((doc, idx) => {
        if (e.metaKey && e.key === `${idx + 2}`) {
          setCurrentDocument(doc.id);
        }
      });

      const currentDocumentIndex = openDocuments.findIndex((doc) => doc.id === currentDocumentId);
      if (e.key === "ArrowLeft" && e.metaKey) {
        if (currentDocumentIndex > 0) {
          setCurrentDocument(openDocuments[currentDocumentIndex - 1].id);
        } else if (isRootDocumentCurrent) {
          setCurrentDocument(openDocuments[openDocuments.length - 1].id);
        } else {
          setCurrentDocument(rootDocumentId);
        }
      } else if (e.key === "ArrowRight" && e.metaKey) {
        if (currentDocumentIndex < openDocuments.length - 1) {
          setCurrentDocument(openDocuments[currentDocumentIndex + 1].id);
        } else {
          setCurrentDocument(rootDocumentId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentDocumentId, setCurrentDocument, rootDocumentId, blockEditorState]);
};
