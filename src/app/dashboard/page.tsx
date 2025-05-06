"use client"

import { useEffect, useState } from "react"

// Layout components
import DashboardLayout from "../../components/layout/DashboardLayout"

// Dashboard components
import BalanceCard from "../../components/dashboard/BalanceCard"
import MonthlyTotals from "../../components/dashboard/MonthlyTotals"
import CategoryExpenses from "../../components/dashboard/CategoryExpenses"
import RecentTransactions from "../../components/dashboard/RecentTransactions"

// Mock data
import {
  recentTransactions,
  monthlyTotals,
  categoryExpenses,
} from "../../mocks/transactions"

// Navigation
import PromptOptionCard from "@/components/transacciones/PromptOptionCard"
import FormularioOptionCard from "@/components/transacciones/FormularioOptionCard"

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

        <div className="flex items-center mt-2">
          <span className="text-gray-500">
            <svg
              className="inline-block w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              ></path>
            </svg>
            Abril 2025
          </span>

          <button className="ml-3 text-blue-600 hover:text-blue-800">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Top row */}
        <div className="md:col-span-7">
          <BalanceCard
            currentBalance={1234.56}
            currency="USD"
            percentChange={8.2}
          />
        </div>
        <div className="md:col-span-5">
          <MonthlyTotals
            income={monthlyTotals.income}
            expense={monthlyTotals.expense}
            balance={monthlyTotals.balance}
          />
        </div>
        <div className="md:col-span-8">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-700">
                Crear transacción
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <FormularioOptionCard />
              <PromptOptionCard />
            </div>
          </div>
        </div>
        <div className="md:col-span-4">
          <CategoryExpenses
            categories={categoryExpenses}
            totalAmount={1265.44}
          />
        </div>

        {/* Bottom row */}
        <div className="md:col-span-12">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
