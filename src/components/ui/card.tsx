import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  className = "",
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} className={`hs-card ${className}`.trim()}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}