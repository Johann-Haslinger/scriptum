import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useCommandMenuUIStore } from "../store";

const CommandMenu = () => {
  const isVisible = useCommandMenuUIStore((state) => state.isCommandMenuOpen);

  const commandMenuVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  useCommandMenuKeyboardNavigation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={commandMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute top-0 right-0 w-48 h-48 bg-white shadow-lg"
        ></motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandMenu;

const useCommandMenuKeyboardNavigation = () => {
  const { isCommandMenuOpen, setIsCommandMenuOpen } = useCommandMenuUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && event.metaKey) {
        setIsCommandMenuOpen(true);
      } else if (event.key === "Escape" && isCommandMenuOpen) {
        setIsCommandMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCommandMenuOpen, setIsCommandMenuOpen]);
};
