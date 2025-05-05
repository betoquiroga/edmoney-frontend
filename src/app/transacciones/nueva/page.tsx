"use client"

import { useRouter } from "next/navigation"
import DashboardLayout from "../../../components/layout/DashboardLayout"
import Link from "next/link"
import {
  ClipboardIcon,
  CommandLineIcon,
  MicrophoneIcon,
} from "@heroicons/react/24/outline"

const NuevaTransaccionPage = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Transacción</h1>
        <p className="text-gray-500 mt-1">
          Elige cómo quieres crear tu transacción
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Opción 1: Formulario */}
        <Link href="/transacciones/nueva/formulario" className="block">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Formulario
            </h2>
            <p className="text-gray-500 text-center">
              Registra tu transacción con un formulario detallado
            </p>
          </div>
        </Link>

        {/* Opción 2: Prompt */}
        <Link href="/transacciones/nueva/prompt" className="block">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <CommandLineIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Prompt</h2>
            <p className="text-gray-500 text-center">
              Escribe la descripción de tu transacción y la crearemos por ti
            </p>
          </div>
        </Link>

        {/* Opción 3: Modo voz */}
        <Link href="/transacciones/nueva/voz" className="block">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MicrophoneIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Modo voz
            </h2>
            <p className="text-gray-500 text-center">
              Dicta los detalles de tu transacción usando tu voz
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Regresar
        </button>
      </div>
    </DashboardLayout>
  )
}

export default NuevaTransaccionPage
