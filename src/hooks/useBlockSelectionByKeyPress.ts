import { useEffect, useState } from "react";
import { useBlocksUIStore } from "../store";
import { useBlockEditorState } from "./useBlockEditorState";
import { useCurrentBlocks } from "./useCurrentBlocks";

export const useBlockSelectionByKeyPress = () => {
  const blockEditorState = useBlockEditorState();
  const blocks = useCurrentBlocks();
  const { setSelected, selectedBlocks: selectedBlocksRecord } = useBlocksUIStore();

  const [selectionDirection, setSelectionDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    setSelectionDirection(null);
  }, [blockEditorState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

      const selectedBlocks = blocks.filter((block) => selectedBlocksRecord[block.id]);
      if (selectedBlocks.length === 0) return;

      const sortedBlocksAsc = [...blocks].sort((a, b) => a.order - b.order);
      const sortedBlocksDesc = [...sortedBlocksAsc].reverse();

      const referenceBlock =
        e.key === "ArrowUp"
          ? sortedBlocksAsc.find((block) => selectedBlocksRecord[block.id])
          : sortedBlocksDesc.find((block) => selectedBlocksRecord[block.id]);

      if (!referenceBlock) return;

      const referenceIndex = blocks.findIndex((b) => b.id === referenceBlock.id);
      if (referenceIndex === -1) return;

      let newIndex = referenceIndex;
      if (e.key === "ArrowUp" && referenceIndex > 0) {
        newIndex--;
      } else if (e.key === "ArrowDown" && referenceIndex < blocks.length - 1) {
        newIndex++;
      }

      if (e.shiftKey) {
        if (selectionDirection === null) {
          setSelectionDirection(e.key === "ArrowUp" ? "up" : "down");
        }

        if (
          (selectionDirection === "down" && e.key === "ArrowUp") ||
          (selectionDirection === "up" && e.key === "ArrowDown")
        ) {
          if (selectedBlocks.length === 1) {
            setSelectionDirection(e.key === "ArrowUp" ? "up" : "down");
          } else {
            const firstSelectedBlock =
              selectionDirection === "up"
                ? sortedBlocksAsc.find((block) => selectedBlocksRecord[block.id])
                : sortedBlocksDesc.find((block) => selectedBlocksRecord[block.id]);

            if (firstSelectedBlock) {
              setSelected(firstSelectedBlock.id, false);
            }
            return;
          }
        }

        setSelected(blocks[newIndex].id, true);
      } else {
        blocks.filter((block) => selectedBlocksRecord[block.id]).forEach((block) => setSelected(block.id, false));
        setSelected(blocks[newIndex].id, true);
        setSelectionDirection(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [blockEditorState, blocks, selectedBlocksRecord, setSelected, selectionDirection]);
};
