import { TransactionPromptResponse } from "@/types/transaction-prompt.types"
import { formatCurrency } from "../../utils/format"
import { useState } from "react"
import { transactionsService } from "../../services/transactions.service"
import { CreateTransactionDto } from "../../types/transaction.types"

interface TransactionPromptModalProps {
  isOpen: boolean
  onClose: () => void
  response: TransactionPromptResponse | null
}

export function TransactionPromptModal({
  isOpen,
  onClose,
  response,
}: TransactionPromptModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState<{
    status: "success" | "error"
    message: string
  } | null>(null)

  if (!isOpen || !response) return null

  const handleSaveTransaction = async () => {
    if (!response.transaction) return

    setIsSaving(true)
    setSaveResult(null)

    try {
      // Map the transaction data to the format expected by the API
      /* eslint-disable camelcase */
      const transactionDto: CreateTransactionDto = {
        user_id: response.transaction.user_id,
        category_id: response.transaction.category_id,
        payment_method_id: response.transaction.payment_method_id,
        input_method_id: response.transaction.input_method_id,
        type: response.transaction.type,
        amount: response.transaction.amount.toString(),
        currency: response.transaction.currency,
        transaction_date: new Date(response.transaction.transaction_date),
        description: response.transaction.description,
        is_recurring: response.transaction.is_recurring,
        recurring_id: response.transaction.recurring_id,
      }
      /* eslint-enable camelcase */

      // Call the API to save the transaction
      await transactionsService.create(transactionDto)

      setSaveResult({
        status: "success",
        message: "Transacción guardada exitosamente",
      })
    } catch (error) {
      console.error("Error saving transaction:", error)
      setSaveResult({
        status: "error",
        message: "Error al guardar la transacción",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-500/50 bg-opacity-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative z-50 w-full max-w-md md:max-w-lg bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-white p-6">
          <div className="flex flex-col">
            {response.transaction ? (
              <div className="w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Detalles de la Transacción
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Tipo: </span>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          response.transaction.type === "expense"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {response.transaction.type === "expense"
                          ? "Gasto"
                          : "Ingreso"}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Monto: </span>
                      <span className="font-semibold">
                        {formatCurrency(
                          response.transaction.amount,
                          response.transaction.currency,
                        )}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="font-medium text-gray-700">
                        Descripción:{" "}
                      </span>
                      <span>
                        {response.transaction.description || "Sin descripción"}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Fecha: </span>
                      <span>
                        {new Date(
                          response.transaction.transaction_date,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="pt-2 text-sm text-green-600">
                      {response.message}
                    </div>

                    {/* Display save result if available */}
                    {saveResult && (
                      <div
                        className={`mt-3 p-2 rounded text-sm ${
                          saveResult.status === "success"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {saveResult.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full text-center">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Respuesta
                </h3>
                <div>
                  <p className="text-md text-gray-500">{response.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-3">
          {response.transaction && (
            <button
              type="button"
              className={`inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSaving ? "opacity-75 cursor-not-allowed" : ""}`}
              onClick={handleSaveTransaction}
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Transacción"}
            </button>
          )}
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
