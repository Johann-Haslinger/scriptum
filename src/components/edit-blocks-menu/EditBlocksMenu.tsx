import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoArrowForward, IoSparkles, IoText, IoTrash } from "react-icons/io5";
import { useBlockEditorState } from "../../hooks";
import { useBlocksStore, useBlocksUIStore } from "../../store";
import { useEditMenuUIStore } from "../../store/editMenuUIStore";
import { Block, BlockEditorState, BlockType, EditOption, EditOptionName } from "../../types";
import EditMenuWrapper from "./EditMenuWrapper";
import EditOptionCell from "./EditOptionCell";
const allEditOptions: EditOption[] = [
  {
    name: EditOptionName.AI,
    icon: <IoSparkles />,
    color: "text-blue-600 dark:text-blue-600/60 bg-blue-600/15 dark:bg-blue-600/10",
    outlineColor: "rgba(0, 123, 255, 0.5)",
    order: 0,
  },
  {
    name: EditOptionName.STYLE,
    icon: <IoText />,
    color: "text-green-600 dark:text-green-600/60 bg-green-600/15 dark:bg-green-600/10",
    outlineColor: "rgba(5, 223, 114, 0.4)",
    order: 1,
  },
  {
    name: EditOptionName.ADD_CONTENT,
    icon: <IoAddCircleOutline />,
    color: "text-fuchsia-600 dark:text-fuchsia-600/60 bg-fuchsia-600/15 dark:bg-fuchsia-600/10",
    outlineColor: "rgba(221, 114, 250, 0.4)",
    order: 2,
  },
  {
    name: EditOptionName.GROUP_BLOCKS,
    icon: <IoArrowForward />,
    color: "text-yellow-600 dark:text-yellow-600/60 bg-yellow-600/15 dark:bg-yellow-600/10",
    outlineColor: "rgba(255, 204, 0, 0.4)",
    order: 3,
  },
  {
    name: EditOptionName.DELETE,
    icon: <IoTrash />,
    color: "text-red-600 dark:text-red-600/60 bg-red-600/15 dark:bg-red-600/10",
    outlineColor: "rgba(255, 59, 48, 0.4)",
    order: 4,
  },
];

const EditBlocksMenu = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;
  const { isRubberBandSelecting } = useBlocksUIStore();
  const { editOptions } = useEditOptions();

  return (
    <AnimatePresence>
      {isVisible && !isRubberBandSelecting && (
        <EditMenuWrapper>
          {editOptions.map((option, index) => (
            <EditOptionCell idx={index} key={index} option={option} />
          ))}
        </EditMenuWrapper>
      )}
    </AnimatePresence>
  );
};

export default EditBlocksMenu;

const useEditOptions = () => {
  const blockEditorState = useBlockEditorState();
  const isVisible = blockEditorState === BlockEditorState.EDITING_BLOCKS;
  const [editOptions, setEditOptions] = useState<EditOption[]>([]);
  const { blocks } = useBlocksStore();
  const { selectedBlockIds } = useBlocksUIStore();
  const { setCurrentEditOption, focusedEditOption, setFocusedEditOption } = useEditMenuUIStore();

  useEffect(() => {
    setCurrentEditOption(null);
    setFocusedEditOption(EditOptionName.AI);
  }, [blockEditorState]);

  const addEditOption = (option: EditOptionName) => {
    setEditOptions((prev) => {
      const newEditOptions = [...prev];
      const index = newEditOptions.findIndex((editOption) => editOption.name === option);
      if (index === -1) {
        const foundOption = allEditOptions.find((editOption) => editOption.name === option);
        if (foundOption) {
          newEditOptions.push(foundOption);
        }
      }
      return newEditOptions.sort((a, b) => a.order - b.order);
    });
  };

  const removeEditOption = (option: EditOptionName) => {
    setEditOptions((prev) => {
      const newEditOptions = prev.filter((editOption) => editOption.name !== option);
      return newEditOptions.sort((a, b) => a.order - b.order);
    });
  };

  useEffect(() => {
    setEditOptions(Object.values(allEditOptions));
  }, [isVisible]);

  useEffect(() => {
    const selectedBlocks: Block[] = blocks.filter((block) => selectedBlockIds[block.id]);
    if (selectedBlocks.length === 1 && selectedBlocks[0]?.type === BlockType.TEXT) {
      removeEditOption(EditOptionName.GROUP_BLOCKS);
      addEditOption(EditOptionName.ADD_CONTENT);

      if (focusedEditOption === EditOptionName.GROUP_BLOCKS) setFocusedEditOption(EditOptionName.ADD_CONTENT);
    } else if (selectedBlocks.length > 1) {
      removeEditOption(EditOptionName.ADD_CONTENT);
      addEditOption(EditOptionName.GROUP_BLOCKS);

      if (focusedEditOption === EditOptionName.ADD_CONTENT) setFocusedEditOption(EditOptionName.GROUP_BLOCKS);
    } else {
      removeEditOption(EditOptionName.GROUP_BLOCKS);
      removeEditOption(EditOptionName.ADD_CONTENT);
    }
    if (selectedBlocks.some((block) => block.type !== BlockType.TEXT)) {
      removeEditOption(EditOptionName.STYLE);
    } else {
      addEditOption(EditOptionName.STYLE);
    }
  }, [selectedBlockIds, blocks, focusedEditOption, setFocusedEditOption, blockEditorState]);

  useEditOptionNavigationByKeyPress(editOptions);

  return { editOptions };
};

const useEditOptionNavigationByKeyPress = (editOptions: EditOption[]) => {
  const { setFocusedEditOption, focusedEditOption, setCurrentEditOption, currentEditOption } = useEditMenuUIStore();
  const { selectedBlockIds, setSelected } = useBlocksUIStore();
  const { blocks } = useBlocksStore();
  const blockEditorState = useBlockEditorState();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (blockEditorState !== BlockEditorState.EDITING_BLOCKS) return;

      const currentIndex = editOptions.findIndex((option) => option.name == focusedEditOption);
      let newIndex = currentIndex;

      if (event.key === "Tab") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % editOptions.length;
      }

      if (event.key === "Escape" && currentEditOption !== null) {
        setCurrentEditOption(null);
      } else if (event.key === "Escape" && blockEditorState == BlockEditorState.EDITING_BLOCKS) {
        blocks.filter((block) => selectedBlockIds[block.id]).forEach((block) => setSelected(block.id, false));
      }

      if (newIndex !== currentIndex) {
        setFocusedEditOption(editOptions[newIndex].name);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    editOptions,
    setFocusedEditOption,
    focusedEditOption,
    blockEditorState,
    currentEditOption,
    selectedBlockIds,
    blocks,
    setCurrentEditOption,
    setSelected,
  ]);
};
