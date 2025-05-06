import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { transactionsService } from "@/services/transactions.service"
import { TransactionPromptResponse } from "@/types/transaction-prompt.types"
import { useState, useRef, ChangeEvent, DragEvent } from "react"

const promptSchema = z.object({
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
})

type PromptFormValues = z.infer<typeof promptSchema>

interface TransactionPromptFormProps {
  onResponse: (response: TransactionPromptResponse) => void
  setLoading: (loading: boolean) => void
}

export function TransactionPromptForm({
  onResponse,
  setLoading,
}: TransactionPromptFormProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      message: "",
    },
  })

  const handleFileChange = (file: File) => {
    if (file) {
      setImageName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setImageBase64(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImageBase64(null)
    setImageName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const contextDefault = `<contexto> user_id: b5284458-258c-4d11-bcd6-2cdf4afda913 Categorías disponibles: ID | name f47ac10b-58cc-4372-a567-0e02b2c3d479 | Alimentación 38c4e644-6c23-4b85-9cb4-93e0b91bab92 | Transporte 1a5f9851-53e1-4f0c-b8ad-76c6b8e4ff37 | Salario c71f23c1-4a09-4b8a-b866-4210b13ee7d8Entretenimiento db3eb5d3-86a6-4d1c-9ca6-6e98baa3d1e6 | Transferencia entre cuentas Payment methods disponibles: id | name eea04a3a-ab7d-46c4-b90e-4aa8f6c4284d | Cash ba384815-d670-47ea-bee1-f919995180ce | Credit Card 780e54f4-3a17-4de0-8645-425681bcd3f5 | Debit Card 51284ad5-0adc-473e-aa64-cc6dd78c03bd | Bank Transfer 30dd8a7f-cc49-490a-8b0a-855fb2d4451d | PayPal (Si el usuario no te dice el método, usa siempre Cash) input_method_id: 5df021e9-7955-49ba-9488-de9a21bc5eca transaction_date: ${new Date().toISOString()} </contexto>`
  const onSubmit = async (data: PromptFormValues) => {
    try {
      setLoading(true)
      const response = await transactionsService.createFromPrompt(
        data.message,
        contextDefault,
        imageBase64 || undefined,
      )
      onResponse({
        transaction: response.transaction,
        message: response.message || "Transacción procesada",
      })
    } catch (error) {
      console.error("Error creating transaction from prompt:", error)
      onResponse({ message: "Error al procesar la transacción" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <div className="mt-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`border-2 border-dashed rounded-md px-6 py-12 lg:py-28 text-center cursor-pointer transition mb-12 ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300/20 hover:border-blue-400"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />

            {imageBase64 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <img
                    src={imageBase64}
                    alt="Vista previa"
                    className="max-h-40 max-w-full object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 truncate">{imageName}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                >
                  Remover imagen
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  {isDragging
                    ? "Suelta la imagen aquí..."
                    : "Arrastra y suelta una imagen, o haz clic para seleccionar"}
                </p>
                <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF</p>
              </div>
            )}
          </div>
        </div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Describe tu transacción
        </label>
        <textarea
          id="message"
          rows={3}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej. Compré un café por $5.50 en la cafetería"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Procesar transacción
        </button>
      </div>
    </form>
  )
}
