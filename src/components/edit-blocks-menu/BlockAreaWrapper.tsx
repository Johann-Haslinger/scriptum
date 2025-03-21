import { PropsWithChildren } from "react";

interface BlockAreaWrapperProps extends PropsWithChildren {
  ref: React.RefObject<HTMLDivElement | null>;
}
const BlockAreaWrapper = ({ children, ref }: BlockAreaWrapperProps) => {
  return (
    <div className="flex justify-center h-screen">
      <div ref={ref} className="w-full pt-16 lg:pt-24 xl:pt-32 2xl:pt-40 lg:w-[50rem] h-fit">
        {children}
      </div>
    </div>
  );
};

export default BlockAreaWrapper;
