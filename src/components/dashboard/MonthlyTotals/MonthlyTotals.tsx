import { MonthlyTotalsProps } from "./types"

const MonthlyTotals = ({ income, expense, balance }: MonthlyTotalsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate balance percentage for progress bar
  const balancePercentage = Math.min(Math.max((balance / income) * 100, 0), 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Ingresos Totales
            </span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              + {formatCurrency(income)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Egresos Totales
            </span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              - {formatCurrency(expense)}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Balance
            </span>
            <span className="text-sm font-semibold dark:text-gray-100">
              + {formatCurrency(balance)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
              style={{ width: `${balancePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthlyTotals
