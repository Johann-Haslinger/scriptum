"use client";

import BlockEditor from "../../components/BlockEditor";

export default function EditorRootPage() {
  return (
    <div className="relative w-full h-screen bg-white dark:bg-[#060506]">
      <img
        className="fixed animate-spin [animation-duration:2200s] bottom-[75%] w-[80rem] left-1/2 -translate-x-1/2"
        src="/images/mesh-gradient.png"
      />

      <BlockEditor />
    </div>
  );
}

// "use client";

// import BlockEditor from "../../components/BlockEditor";

// export default function EditorRootPage() {
//   return (
//     <div className="relative w-full h-screen bg-white dark:bg-[#060506]">
//       <img className="fixed animate-spin opacity-20 [animation-duration:2200s] bottom-[72%] w-[70rem] left-1/2 -translate-x-1/2" src="/images/mesh-gradient.png" />
//       <BlockEditor />
//     </div>
//   );
// }
