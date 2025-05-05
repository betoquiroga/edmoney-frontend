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
  bgColor = "bg-blue-100",
  iconColor = "text-blue-700",
}: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center ${iconColor} mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
