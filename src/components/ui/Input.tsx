import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={`block text-sm font-medium text-gray-800 mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    text-gray-800 placeholder-gray-500
                    ${error ? 'border-red-500' : ''}
                    ${inputClassName}`}
          {...props}
        />
        {error && (
          <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 