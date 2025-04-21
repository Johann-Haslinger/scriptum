import debounce from "lodash.debounce";
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useBlockEditorState, useCurrentBlocks, useOutsideClick, useRootDocument } from "../../hooks";
import {
  useBlocksStore,
  useBlocksUIStore,
  useCommandMenuUIStore,
  useDocumentsStore,
  useDocumentsUIStore,
  useUserStore,
} from "../../store";
import { Block, BlockEditorState, BlockType, DocumentBlock, TextBlock } from "../../types";
import { createNewBlock, createNewDocument } from "../../utils";

type ContentEditableBlock = TextBlock;

const BlockContentEditor = React.memo(({ block }: { block: ContentEditableBlock }) => {
  const { id, content } = block;
  const initialContent = useMemo(() => content, []);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { setFocused } = useBlocksUIStore();
  const { updateBlock } = useBlocksStore();
  const [isEditing, setIsEditing] = useState(false);
  const isFocused = useBlocksUIStore((state) => state.focusedBlockId === id);
  const isEditable = useBlockEditorState() == BlockEditorState.VIEWING;
  const isCommandMenuOpen = useCommandMenuUIStore((state) => state.isCommandMenuOpen);

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

  const allowEditing = useCallback(() => setIsEditing(true), []);
  const forbidEditing = useCallback(() => setIsEditing(false), []);

  useContentUpdateHandler(editorRef, block);
  useEditorFocus(editorRef, id, allowEditing, forbidEditing);
  useEnterKeyHandler(editorRef, block);
  useBackspaceKeyHandler(editorRef, block);
  useArrowKeyHandler(editorRef, block);
  useEscapeKeyHandler(editorRef, block);
  useOutsideClick(editorRef, () => setFocused(null), isFocused && !isCommandMenuOpen);
  useChangeBlockTypeHandler(editorRef, block);

  return (
    <div
      ref={editorRef}
      className={`${!isEditable && "select-none"} w-full h-full min-h-8 py-1 outline-none cursor-text select-text`}
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

const useChangeBlockTypeHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id, type } = block;
  const isShortcutActive = useIsShortCurActive(id);
  const { updateBlock } = useBlocksStore();
  const { userId } = useUserStore();
  const { addDocument } = useDocumentsStore();
  const { setCurrentDocument } = useDocumentsUIStore();

  const handleKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      const editorText = editorRef.current?.innerText || "";
      if (event.key === "-" && editorText === "") {
        console.log("List");
      }
      if (event.key == "d" && event.ctrlKey) {
        console.log("Document");
        event.preventDefault();
        const newDocument = createNewDocument(userId);
        newDocument.name = block.content;

        const updatedBlock = {
          ...block,
          type: BlockType.DOCUMENT,
          refId: newDocument.id,
        } as DocumentBlock;

        await addDocument(newDocument);
        updateBlock(updatedBlock);
        setCurrentDocument(newDocument.id);
      }
    },
    [block, type, updateBlock]
  );

  useEffect(() => {
    if (isShortcutActive && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isShortcutActive, editorRef, handleKeyDown]);
};

const useContentUpdateHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { focusedBlockId } = useBlocksUIStore();
  const isFocused = focusedBlockId === block.id;

  useEffect(() => {
    editorRef.current!.innerText = block.content;
  }, [isFocused, editorRef]);
};

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
  const { isCommandMenuOpen } = useCommandMenuUIStore();
  const blockEditorState = useBlockEditorState();

  useEffect(() => {
    if (isFocused && editorRef.current && !isCommandMenuOpen) {
      allowEditing();

      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);

      setTimeout(() => editorRef.current?.focus(), 1);
    } else if (!isFocused && editorRef.current) {
      editorRef.current.blur();
      forbidEditing();
    }
  }, [isFocused, editorRef, allowEditing, forbidEditing, isCommandMenuOpen, blockEditorState]);
};

const useEnterKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused, setInitialFocusedCursorPosition } = useBlocksUIStore();
  const isShortcutActive = useIsShortCurActive(id);
  const currentBlocks = useCurrentBlocks();
  const { addBlock } = useBlocksStore();

  const handleEnter = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();

        if (!editorRef) return;

        const offset = editorRef.current ? getCursorPosition(editorRef) : 0;

        const fullText = editorRef.current?.innerText || "";

        const beforeCursor = fullText.substring(0, offset);
        const afterCursor = fullText.substring(offset);

        block.content = beforeCursor;
        editorRef.current!.innerText = beforeCursor;

        const blockBelow = findBlockBelow(currentBlocks, block);
        const isBlockBelowEmpty =
          blockBelow && checkIsBlockContentEditable(blockBelow) && blockBelow?.content.trim() === "";

        setInitialFocusedCursorPosition(offset);

        if (isBlockBelowEmpty && !afterCursor) {
          setFocused(blockBelow.id);
        } else {
          const newBlock = createNewBlock(block.documentId) as ContentEditableBlock;
          const newBlockOrder = findBlockInsertionOrder(currentBlocks, block);
          newBlock.type = block.type;
          newBlock.order = newBlockOrder;
          newBlock.content = afterCursor;
          addBlock(newBlock);
          setFocused(newBlock.id);
        }
      }
    },
    [currentBlocks, block, addBlock, setFocused, editorRef]
  );

  useEffect(() => {
    if (isShortcutActive && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleEnter);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleEnter);
      }
    };
  }, [isShortcutActive, editorRef, handleEnter]);
};

const useBackspaceKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused, setInitialFocusedCursorPosition } = useBlocksUIStore();
  const isShortcutActive = useIsShortCurActive(id);
  const currentBlocks = useCurrentBlocks();
  const { deleteBlock } = useBlocksStore();
  const { setIsEditingCurrentDocumentName } = useDocumentsUIStore();
  const { isRootDocumentCurrent } = useRootDocument();

  const handleBackspace = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Backspace" && getCursorPosition(editorRef) === 0) {
        event.preventDefault();

        const blockAbove = findBlockAbove(currentBlocks, block);
        const blockContent = editorRef.current?.innerText || "";

        if (blockAbove && checkIsBlockContentEditable(blockAbove)) {
          blockAbove.content += blockContent;
          setFocused(blockAbove.id);
          deleteBlock(block.id);
          setInitialFocusedCursorPosition(blockAbove.content.length);
        } else if (!blockAbove && !isRootDocumentCurrent) {
          if (blockContent.trim() === "") {
            setIsEditingCurrentDocumentName(true);
            setFocused(null);
            deleteBlock(block.id);
            setInitialFocusedCursorPosition(null);
          }
        } else {
        }
      }
    },
    [
      block,
      currentBlocks,
      deleteBlock,
      setFocused,
      setIsEditingCurrentDocumentName,
      isRootDocumentCurrent,
      setInitialFocusedCursorPosition,
    ]
  );

  useEffect(() => {
    if (isShortcutActive && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleBackspace);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleBackspace);
      }
    };
  }, [isShortcutActive, editorRef, handleBackspace]);
};

const useArrowKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused } = useBlocksUIStore();
  const isShortcutActive = useIsShortCurActive(id);
  const currentBlocks = useCurrentBlocks();

  const handleArrowKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();

        const blockAbove = findBlockAbove(currentBlocks, block);
        const blockBelow = findBlockBelow(currentBlocks, block);

        if (!event.shiftKey) {
          if (event.key === "ArrowUp" && blockAbove) {
            setFocused(blockAbove.id);
          } else if (event.key === "ArrowDown" && blockBelow) {
            setFocused(blockBelow.id);
          }
        }
      }
    },
    [block, currentBlocks, setFocused]
  );

  useEffect(() => {
    if (isShortcutActive && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleArrowKey);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleArrowKey);
      }
    };
  }, [isShortcutActive, editorRef, handleArrowKey]);
};

const useEscapeKeyHandler = (editorRef: RefObject<HTMLDivElement | null>, block: ContentEditableBlock) => {
  const { id } = block;
  const { setFocused } = useBlocksUIStore();
  const isShortcutActive = useIsShortCurActive(id);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFocused(null);
      }
    },
    [setFocused]
  );

  useEffect(() => {
    if (isShortcutActive && editorRef.current) {
      editorRef.current.addEventListener("keydown", handleEscape);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener("keydown", handleEscape);
      }
    };
  }, [isShortcutActive, editorRef, handleEscape]);
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
  return block.type === BlockType.TEXT;
};

const useIsShortCurActive = (blockId: string) => {
  const { focusedBlockId } = useBlocksUIStore();
  const isFocused = focusedBlockId === blockId;
  const { isCommandMenuOpen } = useCommandMenuUIStore();

  return isFocused && !isCommandMenuOpen;
};

const getCursorPosition = (editorRef: RefObject<HTMLDivElement | null>) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;

  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(editorRef.current!);
  preCaretRange.setEnd(range.startContainer, range.startOffset);

  return preCaretRange.toString().length;
};
