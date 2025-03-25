import { motion } from "framer-motion";
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { useIsDarkModeActive } from "../../hooks";
import { useBlocksStore, useBlocksUIStore, useCommandMenuUIStore } from "../../store";
import { useEditMenuUIStore } from "../../store/editMenuUIStore";

const EditMenuWrapper = ({ children }: PropsWithChildren) => {
  const menuHeight = useMenuHeight();
  const menuWidth = useMenuWidth();
  const topDistance = useTopDistance(menuHeight);
  const leftDistance = useLeftDistance(menuWidth);
  const isAnEditOptionSelected = useIsAnOptionSelected();
  const isDarkModeActive = useIsDarkModeActive();
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  useEditMenuOutsideClickHandler(editMenuRef);

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
        ref={editMenuRef}
        data-element-id="edit-blocks-menu"
        className={`fixed space-y-1.5 h-fit p-1.5 rounded-xl`}
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

const useIsAnOptionSelected = () => {
  const { currentEditOption } = useEditMenuUIStore();

  return currentEditOption !== null;
};

const useIsOutsideClickActive = () => {
  const { selectedBlockIds } = useBlocksUIStore();
  const isCommandMenuOpen = useCommandMenuUIStore((state) => state.isCommandMenuOpen);
  const isActive = useMemo(() => {
    console.log("selectedBlockIds", Object.keys(selectedBlockIds).length > 0);
    console.log("isCommandMenuOpen", !isCommandMenuOpen);
    return Object.keys(selectedBlockIds).length > 0 && !isCommandMenuOpen;
  }, [selectedBlockIds, isCommandMenuOpen]);

  return isActive;
};

const useEditMenuOutsideClickHandler = (editMenuRef: React.RefObject<HTMLDivElement | null>) => {
  const isOutsideClickActive = useIsOutsideClickActive();
  const { setSelected, selectedBlockIds } = useBlocksUIStore();

  useEffect(() => {
    console.log("isOutsideClickActive", isOutsideClickActive);
    const handleClick = (event: MouseEvent) => {
      if (editMenuRef?.current && event.target instanceof Node && !editMenuRef.current.contains(event.target)) {
        console.log("selectedBlockIds", selectedBlockIds);
        Object.keys(selectedBlockIds).forEach((blockId: string) => setSelected(blockId, false));
      }
    };
    if (isOutsideClickActive && editMenuRef?.current) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [editMenuRef, isOutsideClickActive, selectedBlockIds, setSelected]);
};
