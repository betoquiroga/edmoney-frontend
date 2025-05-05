export interface CategoryExpense {
  id: string
  name: string
  amount: number
  percentage: number
}

export interface CategoryExpensesProps {
  categories: CategoryExpense[]
  totalAmount: number
}
