import { useBlockEditorState } from "@/hooks";
import { useRef } from "react";
import BlockRenderer from "./BlockRenderer";
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

  return (
    <div>
      <RubberBandSelector blocksAreaRef={blocksAreaRef}>
        <div className="flex flex-col w-full h-full p-4 xl:pt-32 text-black dark:text-white xl:px-60">
          <p className="fixed right-0 top-0 p-4">{blockEditorState}</p>
          <p className="text-3xl font-bold mb-2 px-6">Block Editor</p>
          <BlockRenderer blocksAreaRef={blocksAreaRef} editorId={pageId} />
        </div>
      </RubberBandSelector>
    </div>
  );
}
