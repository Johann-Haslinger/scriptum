import { useBlockEditorState } from "@/hooks";
import { useBlocksUIStore } from "@/store";
import { Block, BlockEditorState } from "@/types";
import { PropsWithChildren, useRef, useState } from "react";

interface BlockWrapperProps extends PropsWithChildren {
  block: Block;
}

const BlockWrapper = ({ children, block }: BlockWrapperProps) => {
  const { id } = block;
  const { selectedBlockIds: selectedBlocks, draggingBlocks } = useBlocksUIStore();
  const blockEditorState = useBlockEditorState();
  const isSelected = selectedBlocks[id] || draggingBlocks[id];

  return (
    <Selectable blockId={id}>
      <div
        data-element-id="block"
        data-block-id={id}
        className={`block min-h-8 px-2 py-0.5 rounded-lg transition-colors
          ${isSelected ? "bg-blue-400/20 " : ""} ${
          blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"
        }`}
      >
        {children}
      </div>
    </Selectable>
  );
};

export default BlockWrapper;

interface SelectableProps extends PropsWithChildren {
  blockId: string;
}
const Selectable = ({ children, blockId }: SelectableProps) => {
  const { selectedBlockIds, setSelected, draggingBlocks } = useBlocksUIStore();
  const isPressed = selectedBlockIds[blockId];
  const blockeditorState = useBlockEditorState();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const toggleIsBlockPressed = () => {
    if (draggingBlocks[blockId]) return;

    if (blockeditorState !== BlockEditorState.WRITING) {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        return;
      }

      if (!isPressed) {
        setSelected(blockId, true);
      } else {
        setSelected(blockId, false);
      }
    }
  };

  const handleMouseDown = () => {
    if (blockeditorState === BlockEditorState.EDITING_BLOCKS) {
      toggleIsBlockPressed();
    }
  };

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    setStartX(touch.clientX);
    timeoutRef.current = setTimeout(() => {
      toggleIsBlockPressed();
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setStartX(null);
    setIsSwiping(false);
    setTranslateX(0);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startX !== null) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - startX;
      const adjustedDeltaX = deltaX / (1 + Math.abs(deltaX) / 100);
      setTranslateX(adjustedDeltaX);

      if (adjustedDeltaX > 50 || adjustedDeltaX < -50) {
        if (!isSwiping) {
          toggleIsBlockPressed();
        }
        setIsSwiping(true);
      }
    }
  };

  const transitionStyle: React.CSSProperties = {
    transition: "transform 0.1s ease-out",
    transform: `translateX(${translateX}px)`,
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={transitionStyle}
    >
      {children}
    </div>
  );
};
