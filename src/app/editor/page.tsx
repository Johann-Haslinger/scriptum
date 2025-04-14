"use client";

import BlockEditor from "../../components/BlockEditor";

export default function EditorRootPage() {
  return (
    <div className="relative w-full h-screen bg-white dark:bg-[#060506]">
      <img
        className="fixed animate-spin select-none opacity-50 [animation-duration:2200s] top-[-67rem] size-[80rem] left-1/2 -translate-x-1/2"
        src="/images/mesh-gradient.png"
      />

      <BlockEditor />
    </div>
  );
}
