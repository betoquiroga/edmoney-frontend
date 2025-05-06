"use client"

import { useState } from "react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid"

type Option = {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

interface FloatingActionButtonProps {
  options: Option[]
}

export function FloatingActionButton({ options }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-2 z-50">
      {isOpen && (
        <div className="flex flex-col gap-2 mb-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                option.onClick()
                setIsOpen(false)
              }}
              className="bg-white text-blue-600 shadow-lg rounded-full py-2 px-4 flex items-center justify-center transition-all hover:bg-blue-50"
            >
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={toggleMenu}
        className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:bg-blue-700"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <PlusIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  )
}
