import { z } from "zod"

// Login form schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email es requerido").email("Email inválido"),
  password: z
    .string()
    .min(1, "Contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
})

// Register form schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nombre es requerido")
      .min(2, "Nombre debe tener al menos 2 caracteres"),
    email: z.string().min(1, "Email es requerido").email("Email inválido"),
    password: z
      .string()
      .min(1, "Contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmar contraseña es requerido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

// Types derived from schemas
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
