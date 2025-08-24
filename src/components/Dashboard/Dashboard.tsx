import { useState, useEffect } from 'react';
import { Container, Box, SelectChangeEvent } from '@mui/material';
import { DashboardService } from '../../services/dashboard.service';
import { useAuth } from '../../context/AuthContext';
import { MetricsData } from '../../types/dashboard.types';
import { 
  CategoriesList,
  DashboardHeader,
  EmptyState,
  ErrorState,
  LoadingState,
  MetricsCards,
  SectionTitle,
  TransactionsList
} from './components';

/**
 * Dashboard principal que muestra métricas financieras al usuario
 */
const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('month');
  const { user } = useAuth();

  /**
   * Formatea un número a formato de moneda
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  /**
   * Maneja el cambio de período seleccionado
   */
  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  /**
   * Obtiene las métricas del servidor
   */
  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user || !user.id) {
        throw new Error('No hay usuario autenticado. Por favor inicie sesión.');
      }
      
      console.log('Fetching metrics for user:', user.id, 'period:', period);
      const data = await DashboardService.getDashboardMetrics(user.id, period);
      console.log('Received metrics data:', data);
      setMetrics(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message || 'Error al cargar los datos');
      setLoading(false);
    }
  };

  // Cargar métricas cuando cambia el período o el usuario
  useEffect(() => {
    fetchMetrics();
  }, [period, user]);

  // Renderizar el estado de carga
  if (loading) {
    return <LoadingState />;
  }

  // Renderizar el estado de error
  if (error) {
    return <ErrorState errorMessage={error} onRetry={fetchMetrics} />;
  }

  // Renderizar el estado vacío
  if (!metrics) {
    return <EmptyState />;
  }

  // Renderizar el dashboard completo
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <DashboardHeader period={period} onPeriodChange={handlePeriodChange} />
      
      <MetricsCards 
        totalIncome={metrics.totalIncome}
        totalExpense={metrics.totalExpense}
        balance={metrics.balance}
        formatCurrency={formatCurrency}
      />

      <Box sx={{ mb: 4 }}>
        <SectionTitle title="Transacciones Recientes" />
        <TransactionsList 
          transactions={metrics.recentTransactions} 
          formatCurrency={formatCurrency} 
        />
      </Box>

      <Box>
        <SectionTitle title="Categorías Principales" />
        <CategoriesList 
          categories={metrics.topCategories} 
          formatCurrency={formatCurrency} 
        />
      </Box>
    </Container>
  );
};

export default Dashboard; 