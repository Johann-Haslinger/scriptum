"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BlockEditor from "@/components/BlockEditor";

export default function EditorPage({ params }: { params: { pageIds: string[] } }) {
  const pagePath = params.pageIds || [];
  const router = useRouter();
  const [stack, setStack] = useState<string[]>(pagePath);

  // Aktualisiere den Stack, wenn sich die URL ändert
  useEffect(() => {
    setStack(pagePath);
  }, [pagePath]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      <AnimatePresence>
        {stack.map((pageId, index) => (
          <motion.div
            key={pageId}
            className="absolute top-0 left-0 w-full h-full"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <BlockEditor
              pageId={pageId}
              onNavigate={(newPageId) => router.push(`/editor/${[...stack, newPageId].join("/")}`)}
              onClose={() => {
                const newStack = stack.slice(0, -1);
                setStack(newStack);
                router.push(`/editor/${newStack.join("/")}`);
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
