/**
 * Interfaz para métricas del dashboard
 */
export interface DashboardMetrics {
  categorySummary: {
    category_id: string;
    category_name: string;
    total: number;
    percentage: number;
  }[];
  monthlyTrend: {
    month: string;
    income: number;
    expense: number;
  }[];
  avgTransaction: number;
  totalTransactions: number;
  mostActiveDay: string;
}

/**
 * Respuesta de la API del dashboard
 */
export interface DashboardResponse {
  metrics: DashboardMetrics;
  message: string;
}

/**
 * Interfaz para los datos de métricas del dashboard
 */
export interface Category {
  id: string;
  name: string;
  total: number;
  count: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface MetricsData {
  /**
   * Ingreso total del usuario
   */
  totalIncome: number;
  
  /**
   * Gasto total del usuario
   */
  totalExpense: number;
  
  /**
   * Balance (ingresos - gastos)
   */
  balance: number;
  
  /**
   * Lista de transacciones recientes
   */
  recentTransactions: Transaction[];
  
  /**
   * Lista de categorías más usadas
   */
  topCategories: Category[];
  
  period: string;
}

// Tipos para estructuras de datos anteriores (se mantienen para compatibilidad)
export interface CategorySummary {
  category_id: string;
  category_name: string;
  total: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expense: number;
}

export interface DashboardMetrics {
  totalTransactions: number;
  avgTransaction: number;
  mostActiveDay: string;
  categorySummary: CategorySummary[];
  monthlyTrend: MonthlyTrend[];
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
} 