import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useBlockEditorState, useIsDarkModeActive } from "../../hooks";
import { useEditMenuUIStore } from "../../store/editMenuUIStore";
import { BlockEditorState, EditOption, EditOptionName } from "../../types";

const EditOptionCell = ({ option, idx }: { option: EditOption; idx: number }) => {
  const { name } = option;
  const { focusedEditOption, setCurrentEditOption, currentEditOption } = useEditMenuUIStore();
  const isFocused = name === focusedEditOption;
  const isCurrent = name === currentEditOption;
  const blockEditorState = useBlockEditorState();
  const height = useEditOptionCellHeight(name);
  const isDarkModeActive = useIsDarkModeActive();

  const handleClick = useCallback(() => {
    if (blockEditorState !== BlockEditorState.EDITING_BLOCKS || focusedEditOption !== name) return;

    switch (name) {
      case EditOptionName.AI:
        setCurrentEditOption(name);
        break;
      case EditOptionName.STYLE:
        setCurrentEditOption(name);
        break;
      case EditOptionName.ADD_CONTENT:
        break;
      case EditOptionName.GROUP_BLOCKS:
        break;
      case EditOptionName.DELETE:
        break;
    }
  }, [name, blockEditorState, focusedEditOption, setCurrentEditOption]);

  useEnterClickListener(() => handleClick());

  const top = isCurrent ? 6 : `${idx * 46 + 6}px`;
  const transition = { type: "spring", duration: 0.7, bounce: 0.15 };
  const backgroundColorWhenCurrent = isDarkModeActive ? "#1f1f1fab" : "#eaeaea70";
  const borderColorWhenCurrent = isDarkModeActive ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.095)";

  return (
    <AnimatePresence>
      {(currentEditOption == name || currentEditOption == null) && (
        <motion.div
          onClick={handleClick}
          initial={{
            fontSize: "1.1rem",
            top,
            opacity: 0,
          }}
          exit={{
            scale: 0.5,
            x: -40,
            opacity: 0,
            top,
          }}
          transition={transition}
          animate={{
            opacity: 1,
            width: isCurrent ? "30.5rem" : "2.5rem",
            height: `${height}rem`,
            top,
            outlineColor: isFocused ? option.outlineColor : "rgba(0, 0, 0, 0)",
            outlineOffset: isFocused ? "0px" : "6px",
            outlineWidth: isFocused ? "1.5px" : "4px",
          }}
          className={`size-10 backdrop-blur-lg outline absolute overflow-hidden p-1 rounded-lg flex justify-center items-center ${option.color}`}
        >
          <motion.div
            className="border-[1.5px] rounded-md "
            initial={{
              width: "60%",
              height: "60%",
            }}
            animate={{
              backgroundColor: isCurrent ? backgroundColorWhenCurrent : "rgba(0, 0, 0, 0)",
              borderColor: isCurrent ? borderColorWhenCurrent : "rgba(0, 0, 0, 0)",
              width: isCurrent ? "100%" : "60%",
              height: isCurrent ? "100%" : "60%",
              padding: isCurrent ? "1rem" : "0",
            }}
          >
            {option.icon}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditOptionCell;

const useEnterClickListener = (callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") callback();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callback]);
};

const useEditOptionCellHeight = (optionName: EditOptionName) => {
  const { currentEditOption } = useEditMenuUIStore();
  const isCurrent = optionName === currentEditOption;

  if (!isCurrent) return 2.5;

  switch (optionName) {
    case EditOptionName.AI:
      return 11.7;
    case EditOptionName.STYLE:
      return 11.7;
  }
};
