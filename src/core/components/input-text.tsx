import { ComponentProps } from "react";

interface InputTextProps extends ComponentProps<"input"> {
  prefix?: string;
}

export function InputText({ prefix, ...props }: InputTextProps) {
  return (
    <label
      htmlFor="text"
      className={`bg-gray-900 w-full flex border-2 border-transparent rounded-md px-4 py-2 focus-within:border-green-500 ${
        props.disabled && ("cursor-not-allowed opacity-70")
      }`}
    >
      {!!prefix && <span className="text-gray-400">{prefix}</span>}
      <input
        id="text"
        type="text"
        {...props}
        className={`color-white focus:outline-none flex-1  bg-transparent ${props.disabled && 'cursor-not-allowed'}`}
      />
    </label>
  );
}
