/* eslint-disable camelcase */
import { Transaction } from "../../../types/transaction.types"
import { TransactionType } from "../../../types/category.types"

interface TransactionItemProps {
  transaction: Transaction
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return "Hoy"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ayer"
  } else {
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }
}

const getCategoryIcon = (categoryId: string | undefined): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    "cat-vivienda": (
      <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
        <span className="text-lg">🏠</span>
      </div>
    ),
    "cat-alimentacion": (
      <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
        <span className="text-lg">🍔</span>
      </div>
    ),
    "cat-transporte": (
      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
        <span className="text-lg">🚗</span>
      </div>
    ),
    "cat-entretenimiento": (
      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
        <span className="text-lg">🎬</span>
      </div>
    ),
    "cat-ingresos": (
      <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-lg">
        <span className="text-lg">💰</span>
      </div>
    ),
    "cat-otros": (
      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
        <span className="text-lg">📦</span>
      </div>
    ),
  }

  return categoryId && icons[categoryId] ? (
    icons[categoryId]
  ) : (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
      <span className="text-lg">📝</span>
    </div>
  )
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const {
    description,
    amount,
    transaction_date,
    type,
    category_id,
    category_name,
  } = transaction

  // Convertir la fecha a objeto Date si es un string
  const parsedDate =
    transaction_date instanceof Date
      ? transaction_date
      : new Date(transaction_date)

  return (
    <div className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="flex-shrink-0 mr-3">{getCategoryIcon(category_id)}</div>

      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {description || "Transacción"}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {category_name || "Sin categoría"}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-medium ${type === TransactionType.INCOME ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {type === TransactionType.INCOME ? "+" : "-"}$
          {Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(parsedDate)}
        </p>
      </div>

      <button className="ml-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
        </svg>
      </button>
    </div>
  )
}

export default TransactionItem
