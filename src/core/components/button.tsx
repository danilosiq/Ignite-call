"use client";

import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
  variant: "primary" | "outline" | "disabled" | "red" |'ghost';
  disabled?: boolean;
  sizes: 'sm'| 'md' |'full'
}

export function Button({
  variant,
  children,
  disabled,
  sizes,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${disabled ? ButtonVariants['disabled'] : ButtonVariants[variant] } ${ ButtonSizes[sizes]} text-sm gap-1 justify-center flex items-center  rounded-md  font-medium`}
      disabled={disabled}
      {...props}
    >

      {children}
    </button>
  );
}

const ButtonVariants = {
  primary: "bg-green-500 text-white hover:bg-green-600",
  outline: "bg-transparent border border-green-500 text-green-500 hover:bg-green-100",
  disabled: "bg-gray-200 text-white cursor-not-allowed",
  red: "bg-red-500 text-white hover:bg-red-600",
  ghost: 'bg-transparent text-white cursor-pointer'
};

const ButtonSizes ={
  sm:'px-4 py-2',
  md:'px-4 py-3',
  full:'w-full py-2'
}