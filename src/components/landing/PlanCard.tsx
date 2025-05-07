import React from "react"
import { Button } from "../ui/Button"

interface PlanFeature {
  text: string
}

interface PlanCardProps {
  name: string
  price: string
  period: string
  description: string
  features: PlanFeature[]
  ctaText: string
  ctaLink: string
  popular?: boolean
}

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  ctaText,
  ctaLink,
  popular = false,
}: PlanCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl ${popular ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200 dark:border-gray-700 shadow-sm"} overflow-hidden relative`}
    >
      {popular && (
        <>
          <div className="absolute top-0 inset-x-0">
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-cyan-400"></div>
          </div>
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
            <div className="inline-flex rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 p-[2px]">
              <div className="rounded-full bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                Popular
              </div>
            </div>
          </div>
        </>
      )}

      <div className="p-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {name}
        </h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            {price}
          </span>
          <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">
            {period}
          </span>
        </div>
        <p className="mt-5 text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-8 py-6">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Button
            href={ctaLink}
            variant={popular ? "primary" : "outline"}
            className={`w-full inline-flex justify-center ${!popular ? "text-blue-700 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-700 dark:border-blue-500" : ""}`}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  )
}
