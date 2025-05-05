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
      <div className="bg-blue-100 p-2 rounded-lg">
        <span className="text-lg">🏠</span>
      </div>
    ),
    "cat-alimentacion": (
      <div className="bg-green-100 p-2 rounded-lg">
        <span className="text-lg">🍔</span>
      </div>
    ),
    "cat-transporte": (
      <div className="bg-yellow-100 p-2 rounded-lg">
        <span className="text-lg">🚗</span>
      </div>
    ),
    "cat-entretenimiento": (
      <div className="bg-red-100 p-2 rounded-lg">
        <span className="text-lg">🎬</span>
      </div>
    ),
    "cat-ingresos": (
      <div className="bg-green-100 p-2 rounded-lg">
        <span className="text-lg">💰</span>
      </div>
    ),
    "cat-otros": (
      <div className="bg-purple-100 p-2 rounded-lg">
        <span className="text-lg">📦</span>
      </div>
    ),
  }

  return categoryId && icons[categoryId] ? (
    icons[categoryId]
  ) : (
    <div className="bg-gray-100 p-2 rounded-lg">
      <span className="text-lg">📝</span>
    </div>
  )
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { description, amount, transaction_date, type, category_id } =
    transaction

  // Format category name if available
  const categoryName = category_id
    ? category_id.replace("cat-", "").charAt(0).toUpperCase() +
      category_id.replace("cat-", "").slice(1)
    : "Sin categoría"

  return (
    <div className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 mr-3">{getCategoryIcon(category_id)}</div>

      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-900">
          {description || "Transacción"}
        </h4>
        <p className="text-xs text-gray-500">{categoryName}</p>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-medium ${type === TransactionType.INCOME ? "text-green-600" : "text-red-600"}`}
        >
          {type === TransactionType.INCOME ? "+" : "-"}$
          {Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">{formatDate(transaction_date)}</p>
      </div>

      <button className="ml-4 text-gray-400 hover:text-gray-600">
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
