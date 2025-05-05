import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  id: string
  label: string
  options: Option[]
  required?: boolean
  error?: FieldError
  register: UseFormRegisterReturn
  placeholder?: string
  className?: string
}

const FormSelect = ({
  id,
  label,
  options,
  required = false,
  error,
  register,
  placeholder = "Seleccionar...",
  className = "",
}: FormSelectProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
        {...register}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export default FormSelect
