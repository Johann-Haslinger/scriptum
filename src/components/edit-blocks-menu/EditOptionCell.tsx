import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useBlockEditorState } from "../../hooks";
import { useEditMenuUIStore } from "../../store/editMenuUIStore";
import { BlockEditorState, EditOption, EditOptionName } from "../../types";

const EditOptionCell = ({ option }: { option: EditOption }) => {
  const { name } = option;
  const { setFocusedEditOption, focusedEditOption, setCurrentEditOption } = useEditMenuUIStore();
  const isFocused = name === focusedEditOption;
  const blockEditorState = useBlockEditorState();

  const focusEditOption = () => setFocusedEditOption(name);

  const handleClick = useCallback(() => {
    if (blockEditorState !== BlockEditorState.EDITING_BLOCKS) return;

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
        setCurrentEditOption(name);
        break;
    }
  }, [name, blockEditorState]);

  useEnterClickListener(() => handleClick());

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={focusEditOption}
      initial={{
        fontSize: "1.1rem",
      }}
      animate={{
        outline: isFocused ? "2px solid" : "2px solid transparent",
        outlineColor: isFocused ? option.outlineColor : "rgba(0, 0, 0, 0)",
        outlineOffset: isFocused ? "0px" : "4px",
        outlineWidth: isFocused ? "1px" : "4px",
        fontSize: isFocused ? "1.3rem" : "1.1rem",
      }}
      className={`size-10 rounded-lg flex items-center justify-center ${option.color}`}
    >
      {option.icon}
    </motion.div>
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
