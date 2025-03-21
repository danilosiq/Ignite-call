interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
  }
  
  export function TextArea({ className, ...props }: TextAreaProps) {
    return (
      <textarea
        {...props} 
        className={`${className} bg-gray-900 rounded-md p-1 w-full text-gray-200`}
      />
    );
  }