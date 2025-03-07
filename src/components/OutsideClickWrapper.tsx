import { useOutsideClick } from "@/hooks";
import { useBlocksUIStore } from "@/store";
import { PropsWithChildren, useRef } from "react";

const OutsideClickWrapper = ({ children }: PropsWithChildren) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { selectedBlocks, setSelected } = useBlocksUIStore();

  const handleOutsideClick = () =>
    Object.keys(selectedBlocks).forEach((blockId) => {
      setSelected(blockId, false);
    });

  useOutsideClick(wrapperRef, handleOutsideClick);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideClickWrapper;
