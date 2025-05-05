/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { transactionFormSchema, TransactionFormInputs } from "./types"
import FormInput from "../../../../components/ui/FormInput"
import FormSelect from "../../../../components/ui/FormSelect"
import FormDatePicker from "../../../../components/ui/FormDatePicker"
import FormCheckbox from "../../../../components/ui/FormCheckbox"
import { transactionsService } from "../../../../services/transactions.service"
import { useState } from "react"
import { TransactionType } from "../../../../types/category.types"
import { CreateTransactionDto } from "../../../../types/transaction.types"

// Mock de métodos de entrada (en un entorno real, esto vendría de la API)
const INPUT_METHODS = {
  MANUAL_FORM: "46de3252-a59f-4e0b-8afc-b81e65b20013", // ID para el formulario manual
}

// Mock del ID de usuario (en un entorno real, vendría de autenticación)
const CURRENT_USER_ID = "b5284458-258c-4d11-bcd6-2cdf4afda913"

const TransactionForm = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // TODO: Replace with real data from backend
  const mockCategories = [
    { value: "f47ac10b-58cc-4372-a567-0e02b2c3d479", label: "Alimentación" },
    { value: "38c4e644-6c23-4b85-9cb4-93e0b91bab92", label: "Transporte" },
    { value: "1a5f9851-53e1-4f0c-b8ad-76c6b8e4ff37", label: "Salario" },
    { value: "c71f23c1-4a09-4b8a-b866-4210b13ee7d8", label: "Entretenimiento" },
    {
      value: "db3eb5d3-86a6-4d1c-9ca6-6e98baa3d1e6",
      label: "Transferencia entre cuentas",
    },
  ]

  const mockPaymentMethods = [
    { value: "30dd8a7f-cc49-490a-8b0a-855fb2d4451d", label: "PayPal" },
    {
      value: "51284ad5-0adc-473e-aa64-cc6dd78c03bd",
      label: "Transferencia bancaria",
    },
    {
      value: "780e54f4-3a17-4de0-8645-425681bcd3f5",
      label: "Tarjeta de débito",
    },
    {
      value: "ba384815-d670-47ea-bee1-f919995180ce",
      label: "Tarjeta de crédito",
    },
    { value: "eea04a3a-ab7d-46c4-b90e-4aa8f6c4284d", label: "Efectivo" },
  ]

  const transactionTypes = [
    { value: TransactionType.INCOME, label: "Ingreso" },
    { value: TransactionType.EXPENSE, label: "Gasto" },
    { value: TransactionType.TRANSFER, label: "Transferencia" },
  ]

  const currencies = [
    { value: "USD", label: "USD - Dólar estadounidense" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "MXN", label: "MXN - Peso mexicano" },
  ]

  // Obtener la fecha y hora actual en formato ISO para el valor por defecto
  const getCurrentDateTimeString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransactionFormInputs>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      userId: CURRENT_USER_ID, // ID de usuario en formato UUID
      inputMethodId: INPUT_METHODS.MANUAL_FORM, // UUID para método de entrada manual
      type: TransactionType.EXPENSE, // Establecer un valor por defecto
      currency: "USD",
      transactionDate: getCurrentDateTimeString(),
      isRecurring: false,
    },
  })

  // Para debug - mostrar valores en tiempo real
  const watchedValues = watch()
  console.log("Valores actuales del formulario:", watchedValues)

  const createTransaction = useMutation({
    mutationFn: async (data: any) => {
      // Convert to API format
      const apiData: CreateTransactionDto = {
        user_id: data.userId,
        category_id: data.categoryId,
        payment_method_id: data.paymentMethodId,
        input_method_id: data.inputMethodId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        transaction_date: data.transactionDate,
        description: data.description,
        is_recurring: data.isRecurring,
        recurring_id: data.recurringId,
      }

      console.log("Enviando datos a la API:", apiData)
      try {
        const result = await transactionsService.create(apiData)
        console.log("Respuesta de la API:", result)
        return result
      } catch (error) {
        console.error("Error en la llamada a la API:", error)
        throw error
      }
    },
    onSuccess: () => {
      console.log("Transacción creada exitosamente, redirigiendo...")
      router.push("/transacciones")
    },
    onError: (error: any) => {
      console.error("Error creating transaction:", error)
      setErrorMessage(
        error?.message ||
          "Error al crear la transacción. Verifica los datos e intenta nuevamente.",
      )
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: TransactionFormInputs) => {
    console.log("Formulario enviado con datos:", data)
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // Asegurarse de que inputMethodId sea un UUID válido
      if (!data.inputMethodId || data.inputMethodId === "1") {
        data.inputMethodId = INPUT_METHODS.MANUAL_FORM
      }

      // Asegurarse de que userId sea un UUID válido
      if (!data.userId || data.userId === "1") {
        data.userId = CURRENT_USER_ID
      }

      // Enviar los datos directamente sin volver a validar con Zod
      // ya que el resolver de react-hook-form ya los validó
      createTransaction.mutate(data)
    } catch (error: any) {
      console.error("Error al procesar el formulario:", error)
      setErrorMessage(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Error al procesar el formulario",
      )
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          id="type"
          label="Tipo de transacción"
          options={transactionTypes}
          register={register("type")}
          error={errors.type}
          required
        />

        <FormInput
          id="amount"
          label="Monto"
          type="number"
          placeholder="0.00"
          register={register("amount")}
          error={errors.amount}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          id="currency"
          label="Moneda"
          options={currencies}
          register={register("currency")}
          error={errors.currency}
          required
        />

        <FormDatePicker
          id="transactionDate"
          label="Fecha y hora"
          register={register("transactionDate")}
          error={errors.transactionDate}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          id="categoryId"
          label="Categoría"
          options={mockCategories}
          register={register("categoryId")}
          error={errors.categoryId}
        />

        <FormSelect
          id="paymentMethodId"
          label="Método de pago"
          options={mockPaymentMethods}
          register={register("paymentMethodId")}
          error={errors.paymentMethodId}
        />
      </div>

      <FormInput
        id="description"
        label="Descripción"
        placeholder="Describe tu transacción"
        register={register("description")}
        error={errors.description}
      />

      <FormCheckbox
        id="isRecurring"
        label="Es una transacción recurrente"
        register={register("isRecurring")}
        error={errors.isRecurring}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : "Guardar transacción"}
        </button>
      </div>

      {/* Debug info - remover en producción */}
      <div className="mt-8 p-4 border border-gray-200 rounded bg-gray-50 text-xs">
        <details>
          <summary className="cursor-pointer font-semibold">
            Debug: Valores del formulario
          </summary>
          <pre className="mt-2 whitespace-pre-wrap">
            {JSON.stringify(watchedValues, null, 2)}
          </pre>
        </details>
      </div>
    </form>
  )
}

export default TransactionForm
