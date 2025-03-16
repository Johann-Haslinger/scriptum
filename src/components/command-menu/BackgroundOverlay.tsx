import { AnimatePresence, motion } from "framer-motion";
import { useCommandMenuUIStore } from "../../store";

const BackgroundOverlay = () => {
  const isVisible = useCommandMenuUIStore((state) => state.isCommandMenuOpen);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black z-10"
        />
      )}
    </AnimatePresence>
  );
};

export default BackgroundOverlay;
