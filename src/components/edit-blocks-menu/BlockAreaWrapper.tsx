import { PropsWithChildren } from "react";

const BlockAreaWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center h-screen">
      <div className="w-full pt-16 lg:pt-24 xl:pt-32 2xl:pt-40 lg:w-[50rem] h-full">{children}</div>
    </div>
  );
};

export default BlockAreaWrapper;
