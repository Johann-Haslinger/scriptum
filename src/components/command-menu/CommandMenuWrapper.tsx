import { motion } from "framer-motion";
import { PropsWithChildren, useRef } from "react";
import { useOutsideClick } from "../../hooks";
import { useCommandMenuUIStore } from "../../store";

const CommandMenuWrapper = ({ children }: PropsWithChildren) => {
  const commandMenuRef = useRef<HTMLDivElement>(null);
  const { setIsCommandMenuOpen, isCommandMenuOpen } = useCommandMenuUIStore();

  const commandMenuVariants = {
    hidden: {
      opacity: 0,
      y: 60,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const transition = { type: "spring", duration: 0.4, bounce: 0.15 };

  useOutsideClick(commandMenuRef, () => setIsCommandMenuOpen(false), isCommandMenuOpen);

  return (
    <motion.div
      ref={commandMenuRef}
      transition={transition}
      variants={commandMenuVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute select-none top-1/3 -translate-y-1/3 z-40 left-1/2 -translate-x-1/2 w-1/2 xl:w-2/5 2xl:w-1/3 h-fit bg-white/10 rounded-2xl backdrop-blur-2xl outline outline-white/20 shadow-2xl"
    >
      {children}
    </motion.div>
  );
};

export default CommandMenuWrapper;
