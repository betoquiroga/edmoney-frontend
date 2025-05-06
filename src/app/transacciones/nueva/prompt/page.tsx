"use client"

import { TransactionPromptContainer } from "../../../../components/transactions/TransactionPromptContainer"
import DashboardLayout from "../../../../components/layout/DashboardLayout"

export default function NewTransactionPromptPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 md:px-0">
        <h1 className="text-2xl font-bold mb-6">
          Nueva Transacción por Descripción
        </h1>
        <TransactionPromptContainer />
      </div>
    </DashboardLayout>
  )
}
