import { useState } from "react"
import Link from "next/link"
import TransactionItem from "./TransactionItem"
import { RecentTransactionsProps } from "./types"

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const [visibleTransactions, setVisibleTransactions] = useState(5)

  const loadMore = () => {
    setVisibleTransactions((prev) => prev + 5)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base font-medium text-gray-700 dark:text-gray-300">
          Últimas Transacciones
        </h3>
        <Link
          href="/transacciones"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Ver Todas
        </Link>
      </div>

      <div className="px-6 divide-y divide-gray-100 dark:divide-gray-700">
        {transactions.slice(0, visibleTransactions).map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}

        {transactions.length > visibleTransactions && (
          <div className="py-4 text-center">
            <button
              onClick={loadMore}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Cargar más transacciones
            </button>
          </div>
        )}

        {transactions.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No hay transacciones recientes
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions
