import React from "react"
import { Logo } from "../ui/Logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">
                <Logo textColor="text-white" />
              </h2>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Tu solución financiera personal
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EDmoney. Todos los derechos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
