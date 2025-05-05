"use client"

import { useRouter } from "next/navigation"
import DashboardLayout from "../../../components/layout/DashboardLayout"

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
          Añade los detalles de tu transacción
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-center text-gray-500">
            Esta página está en desarrollo. Se implementará un formulario para
            crear nuevas transacciones.
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default NuevaTransaccionPage
