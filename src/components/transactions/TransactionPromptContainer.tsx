"use client"

import { useState } from "react"
import { TransactionPromptForm } from "./TransactionPromptForm"
import { TransactionPromptModal } from "./TransactionPromptModal"
import { TransactionPromptResponse } from "@/types/transaction-prompt.types"

export function TransactionPromptContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [response, setResponse] = useState<TransactionPromptResponse | null>(
    null,
  )

  const handleResponse = (responseData: TransactionPromptResponse) => {
    setResponse(responseData)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="w-fullmx-auto">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
              <span className="ml-3 text-gray-600">
                Procesando transacción...
              </span>
            </div>
          ) : (
            <TransactionPromptForm
              onResponse={handleResponse}
              setLoading={setIsLoading}
            />
          )}
        </div>
      </div>

      <TransactionPromptModal
        isOpen={modalOpen}
        onClose={closeModal}
        response={response}
      />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
