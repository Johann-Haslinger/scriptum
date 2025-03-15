import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useState } from "react";
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

  const transition = { type: "spring", duration: 0.7, bounce: 0.15 };

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Tab") {

  return (
    topDistance !== -1 && (
      <motion.div
        data-element-id="edit-blocks-menu"
        className="fixed backdrop-blur-lg z-[200] outline-white/[0.15] outline dark:shadow-[0px_0px_60px_0px_rgba(255, 255, 255, 0.4)] space-y-1.5 bg-[#1f1f1fab] h-fit p-1.5 rounded-xl shadow-lg"
        variants={editMenuVariants}
        transition={transition}
        initial="hidden"
        animate="visible"
        exit="hidden"
        tabIndex={0}
        ref={(element) => {
          if (element) {
            element.addEventListener("keydown", (e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                element.style.transition = "transform 0.3s ease";
                element.style.transform = "scale(0.9)";
                setTimeout(() => {
                  element.style.transform = "scale(1.1)";
                  setTimeout(() => {
                    element.style.transform = "scale(1)";
                  }, 150);
                }, 150);
              }
            });
          }
        }}
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

const useMenuHeight = () => {
  const isAnEditOptionSelected = useIsAnOptionSelected();

  return isAnEditOptionSelected ? 200 : 190;
};
const useMenuWidth = () => {
  const isAnEditOptionSelected = useIsAnOptionSelected();

  return isAnEditOptionSelected ? 500 : 52;
};
