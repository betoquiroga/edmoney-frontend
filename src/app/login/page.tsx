"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import Card from "@/components/ui/Card"
import LoginForm from "@/components/auth/LoginForm"
import { authService } from "@/services/auth.service"
import { Logo } from "@/components/ui/Logo"

export default function LoginPage() {
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Iniciar sesión en tu cuenta
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ingresa tus credenciales para acceder a tu dashboard
          </p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Al iniciar sesión, aceptas nuestros{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Términos de servicio
          </a>{" "}
          y{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Política de privacidad
          </a>
        </p>
      </div>
    </div>
  )
}
