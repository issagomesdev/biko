import { forwardRef } from "react"
import { Icon } from "@iconify/react"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:       string
  error?:       string
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, children, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="font-inter text-sm font-medium text-black">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`h-[48px] w-full appearance-none rounded-xl bg-[#F5F5F5] px-4 pr-10 font-inter text-[15px] outline-none border border-transparent focus:border-black/20 transition-colors disabled:opacity-50 ${
              props.value === "" ? "text-[#999999]" : "text-[#333333]"
            } ${error ? "border-red-400" : ""} ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <Icon
            icon="lucide:chevron-down"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
            width={20}
            height={20}
          />
        </div>
        {error && <span className="font-inter text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)

Select.displayName = "Select"
