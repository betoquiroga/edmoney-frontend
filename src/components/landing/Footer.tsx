import React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">EDmoney</h3>
            <p className="text-gray-400 text-sm">
              La plataforma de gestión financiera más avanzada.
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-gray-400 text-sm text-center">
          <p>
            © {new Date().getFullYear()} EDmoney. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
