"use client";

import { PropsWithChildren, useEffect } from "react";
import { useBlockEditorState } from "../../hooks";
import { BlockEditorState } from "../../types";

const SelectionControlWrapper = ({ children }: PropsWithChildren) => {
  const blockEditorState = useBlockEditorState();
  const isSelectionBlocked = [BlockEditorState.EDITING_BLOCKS, BlockEditorState.DRAGGING_BLOCKS].includes(
    blockEditorState
  );

  useEffect(() => {
    if (isSelectionBlocked) {
      const selection = document.getSelection();
      if (selection) {
        selection.removeAllRanges();
      }
    }
  }, [isSelectionBlocked]);

  return <div className={isSelectionBlocked ? "select-none" : ""}>{children}</div>;
};

export default SelectionControlWrapper;
