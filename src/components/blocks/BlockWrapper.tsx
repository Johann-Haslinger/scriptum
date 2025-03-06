import { Block } from "@/types";
import { PropsWithChildren } from "react";

interface BlockWrapperProps extends PropsWithChildren {
  block: Block;
}

const BlockWrapper = ({ children }: BlockWrapperProps) => {
  return <div>{children}</div>;
};

export default BlockWrapper;
