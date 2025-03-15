import { PropsWithChildren } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipProps extends PropsWithChildren {
  place?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end";
  id: string;
}

const Tooltip = ({ children, place = "top", id }: TooltipProps) => {
  const tooltipStyle = {
    backgroundColor: "rgba(23, 23, 23)",
    borderRadius: "10px",
    whiteSpace: "normal",
    maxWidth: "90vw",
    zIndex: 9999,
  };

  return (
    <ReactTooltip className="outline bg-white/[0.5] outline-white/15" style={tooltipStyle} place={place} id={id}>
      {children}
    </ReactTooltip>
  );
};

export default Tooltip;
