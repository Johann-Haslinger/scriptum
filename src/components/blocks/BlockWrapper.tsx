import { useBlockEditorState, useOutsideClick } from "@/hooks";
import { useBlocksUIStore } from "@/store";
import { Block, BlockEditorState } from "@/types";
import { PropsWithChildren, useRef, useState } from "react";

interface BlockWrapperProps extends PropsWithChildren {
  block: Block;
}

const BlockWrapper = ({ children, block }: BlockWrapperProps) => {
  const { id } = block;
  const { selectedBlocks } = useBlocksUIStore();
  const blockEditorState = useBlockEditorState();
  const isSelected = selectedBlocks[id];

  return (
    <Selectable blockId={id}>
      <div
        className={`${isSelected ? "bg-gray-800" : ""} ${
          blockEditorState == BlockEditorState.SELECTING && "select-none"
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
  const { selectedBlocks, setSelected } = useBlocksUIStore();
  const isPressed = selectedBlocks[blockId];
  const blockeditorState = useBlockEditorState();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textBlockRef = useRef<HTMLElement>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [translateX, setTranslateX] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  useOutsideClick(textBlockRef, () => setTranslateX(0));

  const toggleIsBlockPressed = () => {
    if (blockeditorState !== BlockEditorState.WRITING) {
      if (!isPressed) {
        setSelected(blockId, true);
      } else {
        setSelected(blockId, false);
      }
    }
  };

  const handleMouseDown = () => {
    if (blockeditorState === BlockEditorState.SELECTING) {
      toggleIsBlockPressed();
    } else {
      timeoutRef.current = setTimeout(() => {
        toggleIsBlockPressed();
      }, 500);
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
      if (!true) {
        toggleIsBlockPressed();
      }
      if ("vibrate" in navigator) {
        navigator.vibrate(50);
      }
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
      setTranslateX(deltaX);

      if (deltaX > 50 || deltaX < -50) {
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
