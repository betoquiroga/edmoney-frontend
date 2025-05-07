"use client"

import DashboardLayout from "../../../../components/layout/DashboardLayout"
import TransactionForm from "./TransactionForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

const TransactionFormPage = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Nueva Transacción
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Completa el formulario para registrar una nueva transacción
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <QueryClientProvider client={queryClient}>
          <TransactionForm />
        </QueryClientProvider>
      </div>
    </DashboardLayout>
  )
}

export default TransactionFormPage
