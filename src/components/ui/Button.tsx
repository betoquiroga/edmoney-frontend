type ButtonVariant = "primary" | "secondary"

export interface ButtonProps {
  children: React.ReactNode
  type?: "button" | "submit" | "reset"
  variant?: ButtonVariant
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button = ({
  children,
  type = "button",
  variant = "primary",
  className = "",
  fullWidth = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
  }

  const widthClass = fullWidth ? "w-full" : ""
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
