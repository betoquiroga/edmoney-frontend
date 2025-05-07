import React from "react"

interface LogoProps {
  textColor?: string
  iconSize?: string
}

export function Logo({
  textColor = "text-blue-700 dark:text-blue-400",
  iconSize = "w-4 h-4",
}: LogoProps) {
  return (
    <div className="flex items-center">
      <span className={`font-bold ${textColor}`}>EDmoney</span>
      <svg
        className={`${iconSize} ml-1 ${textColor}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
