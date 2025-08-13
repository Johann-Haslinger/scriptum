import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useBlockEditorState } from "../../hooks";
import { HOME_TAB_ID, useBlocksUIStore, useCommandMenuUIStore, useDocumentTabsStore } from "../../store";
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

  useTabNavigation();

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
                .filter((tab) => tab.id !== HOME_TAB_ID)
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

const useTabNavigation = () => {
  const { tabs, currentTabId, setCurrentTabId, closeTab } = useDocumentTabsStore();

  const blockEditorState = useBlockEditorState();
  const isCommandMenuOpen = useCommandMenuUIStore((state) => state.isCommandMenuOpen);
  const { focusedBlockId } = useBlocksUIStore();

  const tabIds = tabs.map((tab) => tab.id);
  const currentIndex = tabIds.findIndex((id) => id === currentTabId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (blockEditorState !== BlockEditorState.VIEWING || isCommandMenuOpen) return;

      // CMD + 2 → Tab 1, CMD + 3 → Tab 2 ...
      if (e.metaKey && /^[1-9]$/.test(e.key)) {
        const index = parseInt(e.key) - 1;
        const tabId = tabIds[index];
        if (tabId) setCurrentTabId(tabId);
        console.log("CMD + 2-9", { currentTabId, currentIndex });
        return;
      }

      // CMD + ← → Zyklisch durch Tabs
      if (e.metaKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        const index = tabs.findIndex((tab) => tab.id === currentTabId);
        console.log("index", index);
        console.log("CMD + ArrowLeft/ArrowRight", { currentTabId, currentIndex });
        if (currentIndex !== -1) {
          const nextIndex =
            e.key === "ArrowLeft"
              ? (currentIndex - 1 + tabIds.length) % tabIds.length
              : (currentIndex + 1) % tabIds.length;

          const nextTabId = tabIds[nextIndex];
          console.log("nextTabId", nextTabId);
          if (nextTabId) setCurrentTabId(nextTabId);
        }
        return;
      }

      // CMD + ⌫ → Aktuellen Tab schließen (außer Home)
      if (e.metaKey && e.key === "Backspace" && !e.shiftKey) {
        if (currentTabId !== HOME_TAB_ID) {
          const remainingTabs = tabIds.filter((id) => id !== currentTabId);
          const fallbackTabId = remainingTabs[currentIndex - 1] || HOME_TAB_ID;

          closeTab(currentTabId);
          setCurrentTabId(fallbackTabId);
        }
        return;
      }

      // CMD + SHIFT + ⌫ → Alle schließen außer Home
      if (e.metaKey && e.shiftKey && e.key === "Backspace") {
        tabIds.forEach((id) => {
          if (id !== HOME_TAB_ID) closeTab(id);
        });
        setCurrentTabId(HOME_TAB_ID);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tabs, currentTabId, setCurrentTabId, closeTab, blockEditorState, isCommandMenuOpen, focusedBlockId]);
};
