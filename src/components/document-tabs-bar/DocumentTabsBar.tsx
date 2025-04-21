import { AnimatePresence, motion } from "framer-motion";
import { useBlockEditorState } from "../../hooks";
import { useCommandMenuUIStore, useDocumentTabsStore } from "../../store";
import { BlockEditorState } from "../../types";
import RootDocumentTab from "./RootDocumentTab";
import SearchDocumentButton from "./SearchDocumentButton";
import Tab from "./Tab";

const DocumentTabsBar = () => {
  const { tabs } = useDocumentTabsStore();
  const { isCommandMenuOpen } = useCommandMenuUIStore();
  const isVisible = useBlockEditorState() === BlockEditorState.VIEWING && !isCommandMenuOpen;

  const tabBarVariants = {
    hidden: { y: -16, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1 },
  };

  // useTabNavigation();

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
          {Object.values(tabs).length > 0 && (
            <div className="flex ml-2 space-x-2">
              {Object.values(tabs)
                .slice(Math.max(Object.values(tabs).length - 7, 0), Object.values(tabs).length)
                .map((tab, idx) => (
                  <Tab index={idx} tab={tab} key={tab.id} />
                ))}
            </div>
          )}
          <SearchDocumentButton />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentTabsBar;

// const useTabNavigation = () => {
//   const { setCurrentTabId, tabs } = useDocumentTabsStore();
//   const openDocuments = useOpenDocuments();
//   const { rootDocumentId, isRootDocumentCurrent } = useRootDocument();
//   const blockEditorState = useBlockEditorState();
//   const isCommandMenuOpen = useCommandMenuUIStore((state) => state.isCommandMenuOpen);
//   const { focusedBlockId } = useBlocksUIStore();

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (blockEditorState !== BlockEditorState.VIEWING || isCommandMenuOpen) return;

//       if (e.metaKey && e.key === "1") {
//         setCurrentTabId(rootDocumentId);
//       }

//       tabs.forEach((doc, idx) => {
//         if (e.metaKey && e.key === `${idx + 2}`) {
//           setCurrentTabId(doc.id);
//         }
//       });

//       if (openDocuments.length === 0) return;

//       const currentDocumentIndex = openDocuments.findIndex((doc) => doc.id === currentDocumentId);
//       if (e.key === "ArrowLeft" && e.metaKey) {
//         if (currentDocumentIndex > 0) {
//           setCurrentTabId(openDocuments[currentDocumentIndex - 1]?.id);
//         } else if (isRootDocumentCurrent) {
//           setCurrentTabId(openDocuments[openDocuments.length - 1]?.id);
//         } else {
//           setCurrentTabId(rootDocumentId);
//         }
//       } else if (e.key === "ArrowRight" && e.metaKey) {
//         if (currentDocumentIndex >= 0 && currentDocumentIndex < openDocuments.length - 1) {
//           setCurrentTabId(openDocuments[currentDocumentIndex + 1].id);
//         } else if (currentDocumentIndex === openDocuments.length - 1) {
//           setCurrentTabId(rootDocumentId);
//         } else if (isRootDocumentCurrent) {
//           setCurrentTabId(openDocuments[0]?.id || rootDocumentId);
//         }
//       } else if (e.key === "Backspace" && e.metaKey) {
//         if (e.shiftKey) {
//           openDocuments.forEach((doc) => setDocumentOpen(doc.id, false));
//           setCurrentTabId(rootDocumentId);
//         } else if (currentDocumentId !== rootDocumentId) {
//           if (currentDocumentIndex > 0) {
//             setCurrentTabId(openDocuments[currentDocumentIndex - 1]?.id);
//           } else {
//             setCurrentTabId(rootDocumentId);
//           }
//           if (currentDocumentId) setDocumentOpen(currentDocumentId, false);
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [
//     currentDocumentId,
//     setCurrentTabId,
//     rootDocumentId,
//     blockEditorState,
//     isRootDocumentCurrent,
//     openDocuments,
//     setDocumentOpen,
//     isCommandMenuOpen,
//     focusedBlockId,
//   ]);
// };
