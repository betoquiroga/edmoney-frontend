import { CategoryExpensesProps, CategoryExpense } from "./types"

// Simplified chart component
const DonutChart = ({ categories }: { categories: CategoryExpense[] }) => {
  // Set up colors for chart sections
  const colors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#f97316", // orange-500
    "#ef4444", // red-500
    "#a855f7", // purple-500
  ]

  // Calculate offsets for placing each segment
  let cumulativeOffset = 0
  const segments = categories.map((category, index) => {
    const startOffset = cumulativeOffset
    cumulativeOffset += category.percentage
    return {
      name: category.name,
      percentage: category.percentage,
      offset: startOffset,
      color: colors[index % colors.length],
    }
  })

  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>

      {/* Static circle with color segments */}
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        {segments.map((segment, i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={segment.color}
            strokeWidth="20"
            strokeDasharray={`${segment.percentage} 100`}
            strokeDashoffset={`-${segment.offset}`}
            transform="rotate(-90 50 50)"
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <div className="text-sm font-semibold">Total</div>
        <div className="text-xs font-medium">
          ${categories.reduce((acc, cat) => acc + cat.amount, 0).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

const CategoryExpenses = ({
  categories,
  totalAmount,
}: CategoryExpensesProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("$", "")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-700">
          Gasto por Categoría (Este Mes)
        </h3>
      </div>
      <div className="px-6 py-4">
        <div className="flex">
          <div className="flex-1 flex justify-center">
            <DonutChart categories={categories} />
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Total{" "}
            <span className="text-black font-semibold">
              ${formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryExpenses
