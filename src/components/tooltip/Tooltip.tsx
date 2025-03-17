import { PropsWithChildren, ReactNode } from "react";
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
  shortcut?: ReactNode[];
}

const Tooltip = ({ children, place = "top", id, shortcut }: TooltipProps) => {
  const tooltipStyle = {
    backgroundColor: "rgba(23, 23, 23)",
    borderRadius: "10px",
    whiteSpace: "normal",
    maxWidth: "90vw",
    zIndex: 9999,
  };

  return (
    <ReactTooltip className="outline bg-white/[0.5] shadow-xl outline-[#333333]" style={tooltipStyle} place={place} id={id}>
      <div className="flex flex-col items-center">
        <p className="font-medium">{children}</p>
        {shortcut && (
          <div className="flex space-x-1 items-center opacity-60">
            {shortcut.map((symbol) => (
              <div>{symbol} </div>
            ))}
          </div>
        )}
      </div>
    </ReactTooltip>
  );
};

export default Tooltip;
