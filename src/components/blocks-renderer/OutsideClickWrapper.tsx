import { useOutsideClick } from "@/hooks";
import { useBlocksUIStore } from "@/store";
import { PropsWithChildren, useRef } from "react";

const OutsideClickWrapper = ({ children }: PropsWithChildren) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { selectedBlockIds: selectedBlocks, setSelected } = useBlocksUIStore();

  const handleOutsideClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const clickedOnEditMenu = target.closest('[data-element-id="edit-blocks-menu"]');

    if (!(event as MouseEvent).shiftKey && !clickedOnEditMenu) {
      Object.keys(selectedBlocks).forEach((blockId) => {
        setSelected(blockId, false);
      });
    }
  };

  useOutsideClick(wrapperRef, handleOutsideClick);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickWrapper;
