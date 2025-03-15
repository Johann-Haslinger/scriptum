import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoAdd, IoClose, IoHome } from "react-icons/io5";
import { useBlockEditorState } from "../hooks";
import { useDocumentsStore, useDocumentsUIStore } from "../store";
import { BlockEditorState, Document } from "../types";

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
          {openDocuments.map((doc) => (
            <DocumentTab document={doc} key={doc.id} />
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
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={openRootDocument}
      className={`${
        isRootDocumentCurrent
          ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white/80"
          : "bg-black/5 dark:bg-white/[0.07] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/40"
      } overflow-hidden flex space-x-2 rounded-full py-1 items-center px-3`}
    >
      <IoHome />
      <AnimatePresence>
        {isHomeTextVisible && (
          <motion.div
            variants={homeTextVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="font-medium"
          >
            Home
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DocumentTab = ({ document }: { document: Document }) => {
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

  const closeButtonVariants = {
    hidden: { opacity: 0, width: 0, marginRight: 0 },
    visible: { opacity: 1, width: 16, marginRight: 8 },
  };

  return (
    <motion.div
      onClick={setDocumentCurrent}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center active:opacity-50 transition-all rounded-full pr-4 py-1
      ${isCloseIconVisible ? "pl-2" : "pl-4"}
      ${
        isCurrent
          ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white/80"
          : "bg-black/5 dark:bg-white/[0.07] dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/40"
      }`}
    >
      <AnimatePresence>
        {isCloseIconVisible && (
          <motion.div
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
            className="bg-black/30 dark:bg-white/15 hover:bg-black/60 dark:hover:bg-white/40 cursor-pointer size-4 flex justify-center items-center text-sm rounded-full text-white/80 dark:text-black/70"
          >
            <IoClose />
          </motion.div>
        )}
      </AnimatePresence>
      <p className="font-medium">{name}</p>
    </motion.div>
  );
};

const AddTabButton = () => {
  return (
    <motion.div className="p-2 opacity-60 active:opacity-40 hover:opacity-100 transition-all text-xl cursor-pointer">
      <IoAdd />
    </motion.div>
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
