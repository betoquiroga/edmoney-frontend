import { HTMLInputTypeAttribute } from "react"
import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface FormInputProps {
  id: string
  label: string
  type?: HTMLInputTypeAttribute
  placeholder?: string
  required?: boolean
  error?: FieldError
  register: UseFormRegisterReturn
  className?: string
}

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  error,
  register,
  className = "",
}: FormInputProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...register}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export default FormInput
