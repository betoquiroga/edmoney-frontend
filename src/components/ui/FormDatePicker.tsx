import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface FormDatePickerProps {
  id: string
  label: string
  required?: boolean
  error?: FieldError
  register: UseFormRegisterReturn
  className?: string
}

const FormDatePicker = ({
  id,
  label,
  required = false,
  error,
  register,
  className = "",
}: FormDatePickerProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && (
          <span className="text-red-500 dark:text-red-400 ml-1">*</span>
        )}
      </label>
      <input
        id={id}
        type="datetime-local"
        className={`w-full px-3 py-2 border ${
          error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-300 dark:border-gray-700"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
        text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800`}
        {...register}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormDatePicker
