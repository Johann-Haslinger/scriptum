import debounce from "lodash.debounce";
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBlockEditorState, useCurrentBlocks, useOutsideClick } from "../../hooks";
import { useBlocksStore, useBlocksUIStore } from "../../store";
import { Block, BlockEditorState, BlockType, TextBlock, TodoBlock } from "../../types";
import { createNewBlock } from "../../utils";

type ContentEditableBlock = TextBlock | TodoBlock;

const BlockContentEditor = React.memo(({ block }: { block: ContentEditableBlock }) => {
  const { id, content } = block;
  const initialContent = useMemo(() => content, []);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { setFocused } = useBlocksUIStore();
  const { updateBlock } = useBlocksStore();
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useBlocksUIStore((state) => state.focusedBlockId === id);
  const isEditable = useBlockEditorState() == BlockEditorState.VIEWING;

  const debouncedHandleInput = useMemo(
    () => debounce((newValue: string) => updateBlock({ ...block, content: newValue }), 300),
    [block, updateBlock]
  );

  const handleMouseEvents = useMouseSelectionHandler(setIsEditing);
  const handleFocus = useCallback(() => {
    setFocused(id);
    setIsEditing(true);
  }, [id, setFocused]);

  const handleBlur = useBlurHandler(setIsEditing);
  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const newValue = e.currentTarget.textContent || "";
      debouncedHandleInput(newValue);
    },
    [debouncedHandleInput]
  );

  useEditorFocus(
    editorRef,
    id,
    () => setIsEditing(true),
    () => setIsEditing(false)
  );
  useEnterKeyHandler(editorRef, block);
  useBackspaceKeyHandler(editorRef, block);
  useArrowKeyHandler(editorRef, block);
  useOutsideClick(editorRef, () => setFocused(null), isFocused);

  return (
    <div
      ref={editorRef}
      className={`${isFocused && "bg-blue-400/10"} ${!isEditable && "select-none"} w-full h-full min-h-8 py-1 outline-none cursor-text select-text`}
      onMouseDown={handleMouseEvents.handleMouseDown}
      onMouseUp={handleMouseEvents.handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      contentEditable={isEditing && isEditable}
      suppressContentEditableWarning
    >
      {initialContent}
    </div>
  );
});

const useMouseSelectionHandler = (setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => {
  const handleMouseDown = useCallback(() => {
    const selection = window.getSelection();
    setIsEditing(!selection || selection.isCollapsed);
  }, [setIsEditing]);

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    setIsEditing(!selection || selection.isCollapsed);
  }, [setIsEditing]);

  return { handleMouseDown, handleMouseUp };
};

const useBlurHandler = (setIsEditing: React.Dispatch<React.SetStateAction<boolean>>) => {
  return useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setIsEditing(false);
    }
  }, [setIsEditing]);
};

export default BlockContentEditor;

const useEditorFocus = (
  editorRef: RefObject<HTMLDivElement | null>,
  blockId: string,
  allowEditing: () => void,
  forbidEditing: () => void
) => {
  const isFocused = useBlocksUIStore((state) => state.focusedBlockId === blockId);

  useEffect(() => {
    if (isFocused && editorRef.current) {
      allowEditing();

      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      editorRef.current.focus();
    } else if (!isFocused && editorRef.current) {
      editorRef.current.blur();
      forbidEditing();
    }
  }, [isFocused, editorRef, allowEditing, forbidEditing]);
};

const useEnterKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused, focusedBlockId } = useBlocksUIStore();
  const isFocused = focusedBlockId === id;
  const currentBlocks = useCurrentBlocks();
  const { addBlock } = useBlocksStore();

  const handleEnter = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        const blockBelow = findBlockBelow(currentBlocks, block);
        const isBlockBelowEmpty =
          blockBelow && checkIsBlockContentEditable(blockBelow) && blockBelow?.content.trim() === "";

        if (isBlockBelowEmpty) {
          setFocused(blockBelow.id);
        } else {
          const newBlock = createNewBlock(block.documentId);
          const newBlockOrder = findBlockInsertionOrder(currentBlocks, block);
          newBlock.order = newBlockOrder;
          addBlock(newBlock);
          setFocused(newBlock.id);
        }
      }
    },
    [currentBlocks, block, addBlock, setFocused]
  );

  useEffect(() => {
    if (isFocused && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleEnter);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleEnter);
      }
    };
  }, [isFocused, editorRef, handleEnter]);
};

const useBackspaceKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused, focusedBlockId } = useBlocksUIStore();
  const isFocused = focusedBlockId === id;
  const currentBlocks = useCurrentBlocks();
  const { deleteBlock } = useBlocksStore();

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Backspace" && editorRef.current?.textContent === "") {
        event.preventDefault();

        const blockAbove = findBlockAbove(currentBlocks, block);

        if (blockAbove && checkIsBlockContentEditable(blockAbove)) {
          setFocused(blockAbove.id);
          deleteBlock(block.id);
        }
      }
    },
    [block, currentBlocks, deleteBlock, setFocused]
  );

  useEffect(() => {
    if (isFocused && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleBackspace);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleBackspace);
      }
    };
  }, [isFocused, editorRef, handleBackspace]);
};

const useArrowKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused, focusedBlockId } = useBlocksUIStore();
  const isFocused = focusedBlockId === id;
  const currentBlocks = useCurrentBlocks();

  const handleArrowKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();

        const blockAbove = findBlockAbove(currentBlocks, block);
        const blockBelow = findBlockBelow(currentBlocks, block);

        if (event.key === "ArrowUp" && blockAbove) {
          setFocused(blockAbove.id);
        } else if (event.key === "ArrowDown" && blockBelow) {
          setFocused(blockBelow.id);
        }
      }
    },
    [block, currentBlocks, setFocused]
  );

  useEffect(() => {
    if (isFocused && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleArrowKey);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleArrowKey);
      }
    };
  }, [isFocused, editorRef, handleArrowKey]);
};

const findBlockInsertionOrder = (blocks: Block[], block: Block) => {
  const { order } = block;
  const nextBlock = findBlockBelow(blocks, block);
  const newBlockOrder = nextBlock ? (order + nextBlock.order) / 2 : order + 1;

  return newBlockOrder;
};

const findBlockAbove = (blocks: Block[], block: Block) => {
  const { id } = block;
  const currentBlockIndex = blocks.findIndex((b) => b.id === id);
  const blockAbove = blocks[currentBlockIndex - 1];

  return blockAbove;
};

const findBlockBelow = (blocks: Block[], block: Block) => {
  const { id } = block;
  const currentBlockIndex = blocks.findIndex((b) => b.id === id);
  const blockBelow = blocks[currentBlockIndex + 1];

  return blockBelow;
};

const checkIsBlockContentEditable = (block: Block) => {
  return block.type === BlockType.TEXT || block.type === BlockType.TODO;
};
