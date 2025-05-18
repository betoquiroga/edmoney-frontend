import React from "react"
import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: "primary" | "secondary" | "outline"
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "submit",
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-transform hover:-translate-y-1"

  const variantClasses = {
    primary:
      "bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 shadow-lg shadow-blue-700/20 dark:shadow-blue-900/30",
    secondary:
      "bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-lg shadow-blue-800/30 dark:shadow-gray-900/30",
    outline:
      "border border-white text-white hover:bg-white/10 dark:hover:bg-white/20",
  }

  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed hover:translate-y-0"
    : ""

  const classes = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
