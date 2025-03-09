import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { useBlocksUIStore } from "../store";

interface RubberBandSelectorProps extends PropsWithChildren {
  blocksAreaRef: React.RefObject<HTMLDivElement | null>;
}

export const RubberBandSelector = ({ children, blocksAreaRef }: RubberBandSelectorProps) => {
  const { setSelected, setIsRubberBandSelecting } = useBlocksUIStore();
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const threshold = 5;

  useEffect(() => {
    setIsRubberBandSelecting(isSelecting);
  }, [isSelecting]);

  useEffect(() => {
    if (isSelecting) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
  }, [isSelecting]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const blocksArea = blocksAreaRef.current;
    if (blocksArea) {
      const blocksAreaRect = blocksArea.getBoundingClientRect();
      if (
        e.clientX >= blocksAreaRect.left &&
        e.clientX <= blocksAreaRect.right &&
        e.clientY >= blocksAreaRect.top &&
        e.clientY <= blocksAreaRect.bottom
      ) {
        return;
      }
    }

    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!startPos) return;
    const newPos = { x: e.clientX, y: e.clientY };
    setCurrentPos(newPos);

    if (!isSelecting) {
      const distance = Math.sqrt(Math.pow(newPos.x - startPos.x, 2) + Math.pow(newPos.y - startPos.y, 2));
      if (distance >= threshold) {
        setIsSelecting(true);
      } else {
        return;
      }
    }

    const rect = {
      x: Math.min(startPos.x, newPos.x),
      y: Math.min(startPos.y, newPos.y),
      width: Math.abs(newPos.x - startPos.x),
      height: Math.abs(newPos.y - startPos.y),
    };

    document.querySelectorAll(".block").forEach((block) => {
      const blockRect = block.getBoundingClientRect();
      const blockId = block.getAttribute("data-block-id");
      if (
        blockRect.left < rect.x + rect.width &&
        blockRect.right > rect.x &&
        blockRect.top < rect.y + rect.height &&
        blockRect.bottom > rect.y &&
        blockId
      ) {
        setSelected(blockId, true);
      } else if (blockId) {
        setSelected(blockId, false);
      }
    });
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {children}
      {isSelecting && startPos && currentPos && (
        <div
          className="absolute bg-blue-400/20 border border-blue-400/40 rounded-lg"
          style={{
            position: "fixed",
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(currentPos.x - startPos.x),
            height: Math.abs(currentPos.y - startPos.y),
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
