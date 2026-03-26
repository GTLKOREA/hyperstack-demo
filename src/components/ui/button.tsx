import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "secondary",
  className = "",
  children,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const baseClass = variant === "primary" ? "hs-button-primary" : "hs-button";
  return (
    <button {...props} className={`${baseClass} ${className}`.trim()}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}