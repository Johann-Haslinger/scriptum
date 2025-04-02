import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useOpenDocuments, useRootDocument } from "../../hooks";
import { useDocumentsUIStore } from "../../store";
import { Document } from "../../types";
import { Tooltip } from "../tooltip";
import { Command, Delete } from "lucide-react";

const useIsTextTruncated = (text: string) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [text]);

  return { isTruncated, textRef };
};

const DocumentTab = ({ document, index }: { document: Document; index: number }) => {
  const { id, name } = document;
  const { currentDocumentId, setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const { rootDocumentId } = useRootDocument();
  const isCurrent = currentDocumentId === id;
  const [isHovered, setIsHovered] = useState(false);
  const isCloseIconVisible = isHovered || isCurrent;
  const openDocuments = useOpenDocuments();
  const isPlaceholderVisible = !name.trim();
  const { isTruncated, textRef } = useIsTextTruncated(name);
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false);

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
        data-tooltip-id={`document-tab-${id}`}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`flex focus:outline-2 max-w-40 focus:outline-blue-500/40 outline-offset-1 items-center active:opacity-50 transition-all rounded-full pr-4 py-1
      ${isCloseIconVisible ? "pl-2" : "pl-4"}
      ${
        isCurrent
          ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white"
          : "bg-black/5 dark:bg-white/[0.07] dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/70"
      }`}
      >
        <AnimatePresence>
          {isCloseIconVisible && (
            <div>
              <motion.button
                onMouseEnter={() => setIsCloseButtonHovered(true)}
                onMouseLeave={() => setIsCloseButtonHovered(false)}
                onFocus={() => setIsCloseButtonHovered(true)}
                onBlur={() => setIsCloseButtonHovered(false)}
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
                className="bg-black/30 focus:outline-2 outline-blue-500/40 outline-offset-1 dark:bg-white/0 hover:bg-black/60 dark:hover:bg-white/20 cursor-pointer size-4 flex justify-center items-center text-sm rounded-full text-white/80 dark:text-white"
              >
                <IoClose />
              </motion.button>
              <Tooltip shortcut={[<Command key={1} size={14} />, <Delete key={1} size={14} />]}  place="bottom" id="close-document">
                Close document
              </Tooltip>
            </div>
          )}
        </AnimatePresence>
        <p ref={textRef} className="font-medium truncate w-full">
          {isPlaceholderVisible ? "Untitled" : name}
        </p>
      </motion.div>

      {isTruncated && !isCloseButtonHovered && (
        <Tooltip place="bottom" id={`document-tab-${id}`}>
          {name}
        </Tooltip>
      )}
    </div>
  );
};

export default DocumentTab;
