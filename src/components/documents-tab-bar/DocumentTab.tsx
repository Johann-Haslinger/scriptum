import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useOpenDocuments, useRootDocument } from "../../hooks";
import { useDocumentsUIStore } from "../../store";
import { Document } from "../../types";
import { Tooltip } from "../tooltip";

const DocumentTab = ({ document, index }: { document: Document; index: number }) => {
  const { id, name } = document;
  const { currentDocumentId, setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const { rootDocumentId } = useRootDocument();
  const isCurrent = currentDocumentId === id;
  const [isHovered, setIsHovered] = useState(false);
  const isCloseIconVisible = isHovered || isCurrent;
  const openDocuments = useOpenDocuments();

  const setDocumentCurrent = () => setCurrentDocument(id);
  const closeDocument = () => {
    const currentDocumentIndex = openDocuments.findIndex((doc) => doc.id === currentDocumentId);

    if (isCurrent) {
      if (currentDocumentIndex > 0) {
        setCurrentDocument(openDocuments[currentDocumentIndex - 1].id);
      } else {
        setCurrentDocument(rootDocumentId);
      }
    }
    setDocumentOpen(id, false);
  };

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
        <p className="font-medium  line-clamp-1">{name || "Untitled"}</p>
      </motion.div>
    </div>
  );
};

export default DocumentTab;
