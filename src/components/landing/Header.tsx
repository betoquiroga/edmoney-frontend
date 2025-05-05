import React from "react"
import Link from "next/link"
import { Logo } from "../ui/Logo"
import { Button } from "../ui/Button"

export function Header() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            <Logo />
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Iniciar sesión
          </Link>
          <Button href="/registro" variant="primary">
            Registrarse
          </Button>
        </div>
      </div>
    </header>
  )
}
