import { useBlockEditorState, useDisableZoomAndScrollOnTouch } from "@/hooks";
import { useRef } from "react";
import { BlockEditorState } from "../types";
import { BlocksRenderer } from "./blocks-renderer";
import { EditBlocksMenu } from "./edit-blocks-menu";
import BlockAreaWrapper from "./edit-blocks-menu/BlockAreaWrapper";
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
    <div className={`${blockEditorState == BlockEditorState.EDITING_BLOCKS && "select-none"}`}>
      <RubberBandSelector blocksAreaRef={blocksAreaRef}>
        <BlockAreaWrapper>
          <p className="text-3xl font-semibold mb-6 px-8">Block Editor</p>
          <BlocksRenderer blocksAreaRef={blocksAreaRef} editorId={pageId} />
        </BlockAreaWrapper>
      </RubberBandSelector>

      <EditBlocksMenu />
    </div>
  );
}
