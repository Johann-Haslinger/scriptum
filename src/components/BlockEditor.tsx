import { useBlockStore } from "../store/blockStore";
import BlockRenderer from "./BlockRenderer";

export default function BlockEditor({
  pageId,
  onNavigate,
  onClose,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const { blocks, addBlock, updateBlock, deleteBlock, setProvider, loadBlocksFromSupabase, saveBlocksToSupabase } =
    useBlockStore();

  return (
    <div className="flex flex-col w-full h-full p-6 bg-white dark:bg-black shadow-lg">
      <BlockRenderer editorId={pageId} />
    </div>
  );
}
