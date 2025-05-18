import { FC, SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  hint,
  fullWidth = true,
  className = '',
  required,
  leftIcon,
  ...props
}, ref) => {
  
  const baseSelectClasses = "rounded-md shadow-sm px-3 py-2 text-sm border focus:outline-none appearance-none bg-white text-gray-900";
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";
  
  const widthClass = fullWidth ? "w-full" : "";
  
  const selectClasses = `${baseSelectClasses} ${stateClasses} ${widthClass} ${className} ${leftIcon ? 'pl-10' : ''}`;
  
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-800 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select 
          ref={ref}
          className={selectClasses}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {(error || hint) && (
        <p className={`mt-1 text-xs ${error ? "text-red-600" : "text-gray-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 