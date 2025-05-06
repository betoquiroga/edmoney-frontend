"use client"

import DashboardLayout from "../../../components/layout/DashboardLayout"
import FormularioOptionCard from "../../../components/transacciones/FormularioOptionCard"
import PromptOptionCard from "../../../components/transacciones/PromptOptionCard"

const NuevaTransaccionPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Nueva Transacción</h1>
        <p className="text-gray-500 mt-1">
          Elige cómo quieres crear tu transacción
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormularioOptionCard />
        <PromptOptionCard />
      </div>
    </DashboardLayout>
  )
}

export default NuevaTransaccionPage
