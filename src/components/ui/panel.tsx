import type { HTMLAttributes, PropsWithChildren } from "react";

export function Panel({
  className = "",
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} className={`hs-panel ${className}`.trim()}>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}