import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  children: React.ReactNode;
  description: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
}

const Hint = ({
  children,
  description,
  side = "bottom",
  sideOffset = 0,
}: Props) => {
  return (
    <div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent
            sideOffset={sideOffset}
            side={side}
            className="text-xs max-w-[220px] break-words"
          >
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Hint;
