"use client";
import BlockEditor from "@/components/BlockEditor";
import { useRouter } from "next/navigation";

export default function EditorRootPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-white dark:bg-black">
      <BlockEditor
        pageId="root"
        onNavigate={(newPageId) => router.push(`/editor/${newPageId}`)}
        onClose={() => router.push("/")}
      />
    </div>
  );
}
