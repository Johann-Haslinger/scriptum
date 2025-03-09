import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoArrowForward, IoSparkles, IoText, IoTrash } from "react-icons/io5";
import { useBlockEditorState } from "../../hooks";
import { useBlocksStore, useBlocksUIStore } from "../../store";
import { BlockEditorState } from "../../types";

const useTopDistance = (menuHeight: number) => {
  const { selectedBlocks } = useBlocksUIStore();
  const { blocks } = useBlocksStore();
  const [topDistance, setTopDistance] = useState<number | null>(null);

  useEffect(() => {
    const topBlock = blocks.sort((a, b) => a.order - b.order).find((block) => selectedBlocks[block.id]);
    const bottomBlock = blocks.sort((a, b) => b.order - a.order).find((block) => selectedBlocks[block.id]);

    if (topBlock && bottomBlock) {
      const topBlockElement = document.querySelector(`[data-block-id="${topBlock.id}"]`);
      const bottomBlockElement = document.querySelector(`[data-block-id="${bottomBlock.id}"]`);
      if (topBlockElement && bottomBlockElement) {
        const topDistance = topBlockElement.getBoundingClientRect().top;
        const bottomDistance = bottomBlockElement.getBoundingClientRect().bottom;
        const centerDistance = (topDistance + bottomDistance) / 2 - menuHeight / 2;
        setTopDistance(centerDistance);
      }
    }
  }, [selectedBlocks, blocks, menuHeight]);

  return topDistance ? topDistance : -1;
};

const useLeftDistance = (menuWidth: number) => {
  const [leftDistance, setLeftDistance] = useState<number | null>(null);

  useEffect(() => {
    const updateLeftDistance = () => {
      const screenWidth = window.innerWidth;
      const blocksAreaWidth = 50 * 16;
      const blocksAreaLeft = (screenWidth - blocksAreaWidth) / 2;
      const leftDistance = blocksAreaLeft - menuWidth - 10;
      setLeftDistance(leftDistance);
    };

    updateLeftDistance();
    window.addEventListener("resize", updateLeftDistance);

    return () => {
      window.removeEventListener("resize", updateLeftDistance);
    };
  }, [menuWidth]);

  return leftDistance ? leftDistance : -1;
};

const useMenuHeight = () => 190;
const useMenuWidth = () => 52;

const EditBlocksMenu = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;
  const menuHeight = useMenuHeight();
  const menuWidth = useMenuWidth();
  const topDistance = useTopDistance(menuHeight);
  const leftDistance = useLeftDistance(menuWidth);
  const { isRubberBandSelecting } = useBlocksUIStore();

  const editMenuVariants = {
    hidden: {
      opacity: 0,
      top: topDistance,
      left: leftDistance - 20,
      scale: 0.7,
      width: menuWidth,
      height: menuHeight,
    },
    visible: {
      opacity: 1,
      top: topDistance,
      left: leftDistance,
      scale: 1,
      width: menuWidth,
      height: menuHeight,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && topDistance && !isRubberBandSelecting && (
        <motion.div
          className="absolute z-10 space-y-1.5 bg-white/[0.07] h-fit p-1.5 rounded-xl shadow-lg"
          variants={editMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="h-10 w-full text-lg rounded-lg border-2 border-blue-400/60 text-blue-400/60 flex items-center justify-center bg-blue-400/10">
            <IoSparkles />
          </div>
          <div className="h-10 w-full text-lg rounded-lg   text-green-400/60 flex items-center justify-center bg-green-400/10">
            <IoText />
          </div>
          <div className="h-10 w-full text-lg rounded-lg   text-yellow-400/60 flex items-center justify-center bg-yellow-400/10">
            <IoArrowForward />
          </div>
          <div className="h-10 w-full text-lg rounded-lg   text-red-400/60 flex items-center justify-center bg-red-400/10">
            <IoTrash />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditBlocksMenu;
