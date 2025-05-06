import Link from "next/link"
import { ClipboardIcon } from "@heroicons/react/24/outline"

const FormularioOptionCard = () => {
  return (
    <Link href="/transacciones/nueva/formulario" className="block">
      <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Formulario</h2>
        <p className="text-gray-500 text-center">
          Registra tu transacción con un formulario detallado
        </p>
      </div>
    </Link>
  )
}

export default FormularioOptionCard
