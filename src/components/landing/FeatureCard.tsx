import React, { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  bgColor?: string
  iconColor?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  bgColor = "bg-blue-100 dark:bg-blue-900/40",
  iconColor = "text-blue-700 dark:text-blue-400",
}: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center ${iconColor} mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
