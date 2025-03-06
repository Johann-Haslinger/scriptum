import BlockRenderer from "./BlockRenderer";

export default function BlockEditor({
  pageId,
}: {
  pageId: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col w-full h-full p-6 text-black dark:text-white bg-white dark:bg-black shadow-lg">
      <BlockRenderer editorId={pageId} />
    </div>
  );
}
