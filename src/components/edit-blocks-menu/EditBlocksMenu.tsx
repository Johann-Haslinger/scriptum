import { AnimatePresence, motion } from "framer-motion";
import { useBlockEditorState } from "../../hooks";
import { BlockEditorState } from "../../types";

const EditBlocksMenu = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;

  const editMenuVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-0 right-0 p-4 bg-white shadow-lg"
          variants={editMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          Edit
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditBlocksMenu;
