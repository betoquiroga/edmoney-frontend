import { BalanceCardProps } from "./types"

const BalanceCard = ({
  currentBalance,
  currency,
  percentChange,
}: BalanceCardProps) => {
  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(currentBalance)

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-gray-500 text-sm uppercase font-medium mb-2">
        Saldo Actual
      </h2>
      <div className="flex items-baseline mb-4">
        <span className="text-blue-700 text-3xl font-bold mr-1">$</span>
        <span className="text-blue-700 text-3xl font-bold">
          {formattedBalance}
        </span>
        <span className="text-blue-700 text-3xl font-bold ml-2">
          {currency}
        </span>
      </div>

      <div className="flex items-center">
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-sm ${
            percentChange >= 0
              ? "text-green-800 bg-green-100"
              : "text-red-800 bg-red-100"
          }`}
        >
          {percentChange >= 0 ? "↑" : "↓"} {Math.abs(percentChange)}% vs semana
          anterior
        </span>
      </div>
    </div>
  )
}

export default BalanceCard
