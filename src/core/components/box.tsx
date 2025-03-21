import { ReactNode } from "react";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

export function Box({ children, className }: BoxProps) {
  return (
    <div
      className={`rounded-md border-2 border-gray-600 bg-gray-800 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
