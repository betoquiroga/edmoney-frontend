import { FieldError, UseFormRegisterReturn } from "react-hook-form"

interface FormCheckboxProps {
  id: string
  label: string
  error?: FieldError
  register: UseFormRegisterReturn
  className?: string
}

const FormCheckbox = ({
  id,
  label,
  error,
  register,
  className = "",
}: FormCheckboxProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          className={
            "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          }
          {...register}
        />
        <label
          htmlFor={id}
          className="ml-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  )
}

export default FormCheckbox
