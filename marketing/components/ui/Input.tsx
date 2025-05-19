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
  const baseInputClasses = "rounded-md shadow-sm px-3 py-2 text-sm focus:outline-none transition-colors duration-200";
  const stateClasses = error 
    ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-dark text-light placeholder-light/30" 
    : "border-light/10 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-dark text-light placeholder-light/30";
  const iconPaddingLeft = leftIcon ? "pl-10" : "";
  const iconPaddingRight = rightIcon ? "pr-10" : "";
  const widthClass = fullWidth ? "w-full" : "";
  const inputClasses = `${baseInputClasses} ${stateClasses} ${iconPaddingLeft} ${iconPaddingRight} ${widthClass} ${className}`;

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-light/90 mb-1.5">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-light/50">
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
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-light/50">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || hint) && (
        <p className={`mt-1.5 text-xs ${error ? "text-red-400" : "text-light/50"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 