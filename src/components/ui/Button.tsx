import React from "react"
import Link from "next/link"

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: "primary" | "secondary" | "outline"
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
}: ButtonProps) {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium transition-transform hover:-translate-y-1"

  const variantClasses = {
    primary:
      "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-700/20",
    secondary:
      "bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-blue-800/30",
    outline: "border border-white text-white hover:bg-white/10",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
