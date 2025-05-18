import { FC, InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  required,
  ...props
}, ref) => {
  
  const baseInputClasses = "rounded-md shadow-sm px-3 py-2 text-sm border focus:outline-none text-gray-900";
  const stateClasses = error 
    ? "border-red-300 focus:border-red-500 focus:ring-red-500 bg-white" 
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white";
  
  const iconPaddingLeft = leftIcon ? "pl-10" : "";
  const iconPaddingRight = rightIcon ? "pr-10" : "";
  const widthClass = fullWidth ? "w-full" : "";
  
  const inputClasses = `${baseInputClasses} ${stateClasses} ${iconPaddingLeft} ${iconPaddingRight} ${widthClass} ${className}`;
  
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
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input 
          ref={ref}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || hint) && (
        <p className={`mt-1 text-xs ${error ? "text-red-600" : "text-gray-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 