import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div className={cn("lp-aurora-root", className)} {...props}>
      <div className="lp-aurora-overflow" aria-hidden="true">
        <div className={cn("lp-aurora-layer", showRadialGradient && "lp-aurora-radial")} />
      </div>
      {children}
    </div>
  );
};
