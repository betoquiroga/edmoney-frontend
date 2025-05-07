"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { loginSchema, LoginFormValues } from "@/lib/validations/auth.schema"
import { authService } from "@/services/auth.service"
import { LoginDto } from "@/types/auth.types"

import Input from "../ui/Input"
import { Button } from "../ui/Button"

interface ApiError {
  message: string
  status?: number
}

export default function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: () => {
      router.push("/dashboard")
    },
    onError: (error: ApiError) => {
      setAuthError(
        error.message || "Error al iniciar sesión. Verifica tus credenciales.",
      )
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null)
    loginMutation.mutate(data)
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

      <div className="flex justify-end">
        <Link
          href="/recuperar-password"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <Button variant="primary">
        {isSubmitting || loginMutation.isPending
          ? "Iniciando sesión..."
          : "Iniciar Sesión"}
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
