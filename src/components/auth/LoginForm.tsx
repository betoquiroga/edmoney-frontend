"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { loginSchema, LoginFormValues } from "@/lib/validations/auth.schema"
import { LoginDto } from "@/types/auth.types"
import { useAuth } from "@/context/AuthContext"

import Input from "../ui/Input"
import { Button } from "../ui/Button"

export default function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null)
    setIsLoading(true)
    
    try {
      const success = await login(data.email, data.password)
      
      if (success) {
        console.log('Login exitoso, redirigiendo a dashboard')
        router.push("/dashboard")
      } else {
        setAuthError("Error al iniciar sesión. Verifica tus credenciales.")
      }
    } catch (error: any) {
      console.error('Error en login:', error)
      setAuthError(error.message || "Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authError && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-4">
          {authError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        placeholder="tu@email.com"
      />

      <Input
        label="Contraseña"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        placeholder="******"
      />

      <Button variant="primary" disabled={isLoading}>
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </form>
  )
}
