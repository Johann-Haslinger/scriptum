import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useState } from "react";
import { useIsDarkModeActive } from "../../hooks";
import { useBlocksStore, useBlocksUIStore } from "../../store";
import { useEditMenuUIStore } from "../../store/editMenuUIStore";

const useIsAnOptionSelected = () => {
  const { currentEditOption } = useEditMenuUIStore();

  return currentEditOption !== null;
};

const EditMenuWrapper = ({ children }: PropsWithChildren) => {
  const menuHeight = useMenuHeight();
  const menuWidth = useMenuWidth();
  const topDistance = useTopDistance(menuHeight);
  const leftDistance = useLeftDistance(menuWidth);
  const isAnEditOptionSelected = useIsAnOptionSelected();
  const isDarkModeActive = useIsDarkModeActive();

  const backgroundColorWhenVisible = isDarkModeActive ? "#1f1f1f38" : "#eaeaea4b";

  const editMenuVariants = {
    hidden: {
      opacity: 0,
      top: topDistance,
      left: leftDistance - 20,
      scale: 0.7, 
      width: menuWidth,
      height: menuHeight,
      outlineColor: "rgba(0, 0, 0, 0)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
    visible: {
      opacity: 1,
      top: topDistance,
      left: leftDistance,
      scale: 1,
      width: menuWidth,
      height: menuHeight,
      outlineColor: isAnEditOptionSelected ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0.13)",
      backgroundColor: isAnEditOptionSelected ? "rgba(0, 0, 0, 0)" : backgroundColorWhenVisible,
    },
  };

  const transition = { type: "spring", duration: 0.7, bounce: 0.15 };

  return (
    topDistance !== -1 && (
      <motion.div
        data-element-id="edit-blocks-menu"
        className={`fixed z-20 space-y-1.5 h-fit p-1.5 rounded-xl`}
        variants={editMenuVariants}
        transition={transition}
        initial="hidden"
        animate="visible"
        exit="hidden"
        tabIndex={0}
      >
        {children}
      </motion.div>
    )
  );
};

export default EditMenuWrapper;

const useTopDistance = (menuHeight: number) => {
  const { selectedBlockIds: selectedBlocks } = useBlocksUIStore();
  const { blocks } = useBlocksStore();
  const [topDistance, setTopDistance] = useState<number | null>(null);
  const isAnEditOptionSelected = useIsAnOptionSelected();

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

        if (isAnEditOptionSelected) {
          setTopDistance(bottomDistance + 8);
        } else {
          setTopDistance(centerDistance);
        }
      }
    }
  }, [selectedBlocks, blocks, menuHeight, isAnEditOptionSelected]);

  return topDistance ? topDistance : -1;
};

const useLeftDistance = (menuWidth: number) => {
  const [leftDistance, setLeftDistance] = useState<number | null>(null);
  const isAnEditOptionSelected = useIsAnOptionSelected();

  useEffect(() => {
    const updateLeftDistance = () => {
      const screenWidth = window.innerWidth;
      const blocksAreaWidth = 50 * 16;
      const blocksAreaLeft = (screenWidth - blocksAreaWidth) / 2;

      if (!isAnEditOptionSelected) {
        const leftDistance = blocksAreaLeft - menuWidth - 10;
        setLeftDistance(leftDistance);
      } else {
        setLeftDistance(blocksAreaLeft + 20);
      }
    };

    updateLeftDistance();
    window.addEventListener("resize", updateLeftDistance);

    return () => {
      window.removeEventListener("resize", updateLeftDistance);
    };
  }, [menuWidth, isAnEditOptionSelected]);

  return leftDistance ? leftDistance : -1;
};

const useMenuHeight = () => 190;
const useMenuWidth = () => {
  const isAnEditOptionSelected = useIsAnOptionSelected();

  return isAnEditOptionSelected ? 52 : 52;
};
