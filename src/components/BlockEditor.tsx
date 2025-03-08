import { useBlockEditorState } from "../hooks";
import BlockRenderer from "./BlockRenderer";

export default function BlockEditor({
  pageId,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const blockEditorState = useBlockEditorState();

  return (
    <div className="flex flex-col w-full h-full p-4 xl:py-20 text-black dark:text-white bg-white dark:bg-black xl:px-60">
      <p className="fixed right-0 top-0 p-4">{blockEditorState}</p>
      <p className="text-2xl font-semibold my-4">Block Editor</p>
      <BlockRenderer editorId={pageId} />
    </div>
  );
}
