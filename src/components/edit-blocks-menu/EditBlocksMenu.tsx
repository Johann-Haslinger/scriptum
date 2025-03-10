import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IoArrowForward, IoSparkles, IoText, IoTrash } from "react-icons/io5";
import { useBlockEditorState } from "../../hooks";
import { useBlocksStore, useBlocksUIStore } from "../../store";
import { BlockEditorState } from "../../types";

const EditBlocksMenu = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;
  const menuHeight = useMenuHeight();
  const menuWidth = useMenuWidth();
  const topDistance = useTopDistance(menuHeight);
  const leftDistance = useLeftDistance(menuWidth);
  const { isRubberBandSelecting } = useBlocksUIStore();
  const { editOptions, focusEditOption } = useEditOptions();

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
          {editOptions.map((option, index) => (
            <EditOption key={index} option={option} focusEditOption={() => focusEditOption(index)} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditBlocksMenu;

const EditOption = ({ option, focusEditOption }: { option: EditOption; focusEditOption: () => void }) => {
  return (
    <motion.div
      onMouseEnter={focusEditOption}
      animate={{
        outline: option.isFocused ? "2px solid" : "2px solid transparent",
        outlineColor: option.isFocused ? option.outlineColor : "rgba(0, 0, 0, 0)",
        outlineOffset: option.isFocused ? "0px" : "4px",
        outlineWidth: option.isFocused ? "2px" : "4px",
      }}
      className={`h-10 w-full text-lg rounded-lg flex items-center justify-center ${option.color}`}
      onClick={option.onClick}
    >
      {option.icon}
    </motion.div>
  );
};

interface EditOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  outlineColor: string;
  isFocused?: boolean;
}

const useEditOptions = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;

  const allEditOptions: Record<string, EditOption> = {
    ai: {
      name: "AI",
      icon: <IoSparkles />,
      color: "text-blue-400/60 bg-blue-400/10",
      onClick: () => console.log("ai"),
      outlineColor: "rgba(0, 123, 255, 0.5)",
      isFocused: true,
    },
    style: {
      name: "Style",
      icon: <IoText />,
      color: "text-green-400/60 bg-green-400/10",
      onClick: () => console.log("style"),
      outlineColor: "rgba(5, 223, 114, 0.5)",
    },
    addContent: {
      name: "Add Content",
      icon: <IoArrowForward />,
      color: "text-yellow-400/60 bg-yellow-400/10",
      onClick: () => console.log("add content"),
      outlineColor: "rgba(255, 204, 0, 0.5)",
    },
    delete: {
      name: "Delete",
      icon: <IoTrash />,
      color: "text-red-400/60 bg-red-400/10",
      onClick: () => console.log("delete"),
      outlineColor: "rgba(255, 59, 48, 0.5)",
    },
  };
  const [editOptions, setEditOptions] = useState<EditOption[]>([]);

  useEffect(() => {
    setEditOptions(Object.values(allEditOptions));
  }, [isVisible]);

  const focusEditOption = (index: number) => {
    const newEditOptions = editOptions.map((option, i) => ({
      ...option,
      isFocused: i === index,
    }));
    setEditOptions(newEditOptions);
  };

  useNavigateInEditOptionsListener(editOptions, setEditOptions);

  return { editOptions, focusEditOption };
};

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

const useNavigateInEditOptionsListener = (
  editOptions: EditOption[],
  setEditOptions: (newValue: EditOption[]) => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey) return;

      const currentIndex = editOptions.findIndex((option) => option.isFocused);
      let newIndex = currentIndex;

      if (event.key === "ArrowDown" || event.key === "Tab") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % editOptions.length;
      } else if (event.key === "ArrowUp") {
        newIndex = (currentIndex - 1 + editOptions.length) % editOptions.length;
      }

      if (newIndex !== currentIndex) {
        const newEditOptions = editOptions.map((option, index) => ({
          ...option,
          isFocused: index === newIndex,
        }));
        setEditOptions(newEditOptions);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editOptions, setEditOptions]);
};
