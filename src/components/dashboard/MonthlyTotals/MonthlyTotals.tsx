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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Ingresos Totales
            </span>
            <span className="text-sm font-semibold text-green-600">
              + {formatCurrency(income)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              Egresos Totales
            </span>
            <span className="text-sm font-semibold text-red-600">
              - {formatCurrency(expense)}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Balance</span>
            <span className="text-sm font-semibold">
              + {formatCurrency(balance)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${balancePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonthlyTotals
