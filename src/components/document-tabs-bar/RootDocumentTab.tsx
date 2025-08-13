import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import { HOME_TAB_ID, useDocumentTabsStore } from "../../store";

const RootDocumentTab = () => {
  const { isHomeTabCurrent } = useHomeTab();
  const { setCurrentTabId, tabs } = useDocumentTabsStore();
  const [isHovered, setIsHovered] = useState(false);
  const isHomeTextVisible = isHovered || isHomeTabCurrent;

  const openRootDocument = () => {
    console.log("tabs", tabs);
    setCurrentTabId(HOME_TAB_ID);
  };

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
          isHomeTabCurrent
            ? "bg-black/10 dark:bg-white/15 text-black/80 dark:text-white"
            : "bg-black/5 dark:bg-white/[0.07] hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer text-black/40 dark:text-white/70"
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

export default RootDocumentTab;

const useHomeTab = () => {
  const { tabs, currentTabId } = useDocumentTabsStore();
  const homeTab = tabs.find((tab) => tab.id === HOME_TAB_ID);
  const isHomeTabCurrent = currentTabId === HOME_TAB_ID;

  return {
    homeTab,
    isHomeTabCurrent,
  };
};
