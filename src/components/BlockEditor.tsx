import { useBlockEditorState, useDisableZoomAndScrollOnTouch } from "@/hooks";
import { PropsWithChildren, useRef } from "react";
import { BlockEditorState } from "../types";
import BlocksRenderer from "./BlocksRenderer";
import { RubberBandSelector } from "./RubberBandSelector";

export default function BlockEditor({
  pageId,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const blockEditorState = useBlockEditorState();

  const blocksAreaRef = useRef<HTMLDivElement | null>(null);

  useDisableZoomAndScrollOnTouch();

  return (
    <div className={`${blockEditorState == BlockEditorState.SELECTING && "select-none"}`}>
      <RubberBandSelector blocksAreaRef={blocksAreaRef}>
        <p className="fixed right-0 top-0 p-4">{blockEditorState}</p>
        <BlockAreaWrapper>
          <p className="text-3xl font-extrabold mb-2 px-6">Block Editor</p>
          <BlocksRenderer blocksAreaRef={blocksAreaRef} editorId={pageId} />
        </BlockAreaWrapper>
      </RubberBandSelector>
    </div>
  );
}

const BlockAreaWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center h-screen">
      <div className="w-full pt-16 lg:pt-24 xl:pt-32 2xl:pt-40 lg:w-[60rem] h-full">{children}</div>
    </div>
  );
};
