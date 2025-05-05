/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { transactionFormSchema, TransactionFormValues } from "./types"
import FormInput from "../../../../components/ui/FormInput"
import FormSelect from "../../../../components/ui/FormSelect"
import FormDatePicker from "../../../../components/ui/FormDatePicker"
import FormCheckbox from "../../../../components/ui/FormCheckbox"
import { transactionsService } from "../../../../services/transactions.service"
import { useState } from "react"
import { TransactionType } from "../../../../types/category.types"
import { CreateTransactionDto } from "../../../../types/transaction.types"

const TransactionForm = () => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      userId: "1", // This should come from auth context
      inputMethodId: "1", // Assuming "1" is the ID for manual form input
      currency: "USD",
      transactionDate: new Date(),
      isRecurring: false,
    },
  })

  const createTransaction = useMutation({
    mutationFn: (data: TransactionFormValues) => {
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
      return transactionsService.create(apiData)
    },
    onSuccess: () => {
      router.push("/transacciones")
    },
    onError: (error) => {
      console.error("Error creating transaction:", error)
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: TransactionFormValues) => {
    setIsSubmitting(true)
    createTransaction.mutate(data)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
    </form>
  )
}

export default TransactionForm
