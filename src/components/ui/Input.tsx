import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="font-inter text-sm font-medium text-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`h-[52px] w-full rounded-xl bg-[#F5F5F5] px-4 font-inter text-base text-black placeholder:text-[#999999] outline-none border border-transparent focus:border-black/20 transition-colors ${error ? "border-red-400" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span className="font-inter text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
