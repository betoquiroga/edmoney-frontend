import { z } from "zod"
import { TransactionType } from "../../../../types/category.types"

// Input type for the form
export interface TransactionFormInputs {
  userId: string
  categoryId?: string
  paymentMethodId?: string
  inputMethodId: string
  type: TransactionType
  amount: string
  currency: string
  transactionDate: string
  description?: string
  isRecurring: boolean
  recurringId?: string
}

// Schema for transaction form validation
export const transactionFormSchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
  categoryId: z.string().uuid("ID de categoría inválido").optional(),
  paymentMethodId: z.string().uuid("ID de método de pago inválido").optional(),
  inputMethodId: z.string().uuid("ID de método de entrada inválido"),
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Tipo de transacción inválido" }),
  }),
  amount: z.string().min(1, "El monto es requerido"),
  currency: z.string().length(3, "La moneda debe tener 3 caracteres"),
  transactionDate: z
    .union([
      z.string().min(1, "La fecha de transacción es requerida"),
      z.date(),
    ])
    .transform((val) => (val instanceof Date ? val : new Date(val))),
  description: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringId: z.string().uuid("ID recurrente inválido").optional(),
})

// Type inferred from the schema
export type TransactionFormValues = z.infer<typeof transactionFormSchema>

// Category interface for form select
export interface Category {
  id: string
  name: string
  type: TransactionType
  icon?: string
  color?: string
}

// Payment method interface for form select
export interface PaymentMethod {
  id: string
  name: string
  icon?: string
}

// Input method interface for form select
export interface InputMethod {
  id: string
  name: string
}
