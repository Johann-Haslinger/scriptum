import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useBlockEditorState, useOpenDocuments, useRootDocument } from "../../hooks";
import { useBlocksUIStore, useCommandMenuUIStore, useDocumentsUIStore } from "../../store";
import { BlockEditorState } from "../../types";
import DocumentTab from "./DocumentTab";
import RootDocumentTab from "./RootDocumentTab";
import SearchDocumentButton from "./SearchDocumentButton";

const DocumentsTabBar = () => {
  const openDocuments = useOpenDocuments();
  const { isCommandMenuOpen } = useCommandMenuUIStore();
  const isVisible = useBlockEditorState() === BlockEditorState.VIEWING && !isCommandMenuOpen;

  const tabBarVariants = {
    hidden: { y: -16, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1 },
  };

  useDocumentsNavigation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={tabBarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed select-none z-5 flex top-4 w-fit left-1/2 transform -translate-x-1/2"
        >
          <RootDocumentTab />
          {openDocuments.length > 0 && (
            <div className="flex ml-2 space-x-2">
              {openDocuments
                .filter((doc) => doc.type !== "root")
                .slice(Math.max(openDocuments.length - 7, 0), openDocuments.length)
                .map((doc, idx) => (
                  <DocumentTab index={idx} document={doc} key={doc.id} />
                ))}
            </div>
          )}
          <SearchDocumentButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentsTabBar;

const useDocumentsNavigation = () => {
  const { currentDocumentId, setCurrentDocument, setDocumentOpen } = useDocumentsUIStore();
  const openDocuments = useOpenDocuments();
  const { rootDocumentId, isRootDocumentCurrent } = useRootDocument();
  const blockEditorState = useBlockEditorState();
  const isCommandMenuOpen = useCommandMenuUIStore((state) => state.isCommandMenuOpen);
  const { focusedBlockId } = useBlocksUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (blockEditorState !== BlockEditorState.VIEWING || isCommandMenuOpen) return;

      if (e.metaKey && e.key === "1") {
        setCurrentDocument(rootDocumentId);
      }

      openDocuments.forEach((doc, idx) => {
        if (e.metaKey && e.key === `${idx + 2}`) {
          setCurrentDocument(doc.id);
        }
      });

      if (openDocuments.length === 0) return;

      const currentDocumentIndex = openDocuments.findIndex((doc) => doc.id === currentDocumentId);
      if (e.key === "ArrowLeft" && e.metaKey) {
        if (currentDocumentIndex > 0) {
          setCurrentDocument(openDocuments[currentDocumentIndex - 1]?.id);
        } else if (isRootDocumentCurrent) {
          setCurrentDocument(openDocuments[openDocuments.length - 1]?.id);
        } else {
          setCurrentDocument(rootDocumentId);
        }
      } else if (e.key === "ArrowRight" && e.metaKey) {
        if (currentDocumentIndex >= 0 && currentDocumentIndex < openDocuments.length - 1) {
          setCurrentDocument(openDocuments[currentDocumentIndex + 1].id);
        } else if (currentDocumentIndex === openDocuments.length - 1) {
          setCurrentDocument(rootDocumentId);
        } else if (isRootDocumentCurrent) {
          setCurrentDocument(openDocuments[0]?.id || rootDocumentId);
        }
      } else if (e.key === "Backspace" && e.metaKey) {
        if (e.shiftKey) {
          openDocuments.forEach((doc) => setDocumentOpen(doc.id, false));
          setCurrentDocument(rootDocumentId);
        } else if (currentDocumentId !== rootDocumentId) {
          if (currentDocumentIndex > 0) {
            setCurrentDocument(openDocuments[currentDocumentIndex - 1]?.id);
          } else {
            setCurrentDocument(rootDocumentId);
          }
          if (currentDocumentId) setDocumentOpen(currentDocumentId, false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentDocumentId,
    setCurrentDocument,
    rootDocumentId,
    blockEditorState,
    isRootDocumentCurrent,
    openDocuments,
    setDocumentOpen,
    isCommandMenuOpen,
    focusedBlockId,
  ]);
};
