import { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, CardContent, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Button } from '@mui/material';
import { DashboardService } from '../services/dashboard.service';
import { useAuth } from '../context/AuthContext';
import { MetricsData, Transaction, Category } from '../types/dashboard.types';

const Dashboard = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('month');
  const { user } = useAuth();

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

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

  useEffect(() => {
    fetchMetrics();
  }, [period, user]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={fetchMetrics}>
            Reintentar
          </Button>
        </Box>
      </Container>
    );
  }

  if (!metrics) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No hay datos disponibles para mostrar.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="period-select-label">Período</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={period}
            label="Período"
            onChange={handlePeriodChange}
          >
            <MenuItem value="week">Semanal</MenuItem>
            <MenuItem value="month">Mensual</MenuItem>
            <MenuItem value="quarter">Trimestral</MenuItem>
            <MenuItem value="year">Anual</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Ingresos Totales
            </Typography>
            <Typography variant="h5" component="div" color="success.main">
              {formatCurrency(metrics.totalIncome)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Gastos Totales
            </Typography>
            <Typography variant="h5" component="div" color="error.main">
              {formatCurrency(metrics.totalExpense)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Balance
            </Typography>
            <Typography 
              variant="h5" 
              component="div" 
              color={metrics.balance >= 0 ? 'success.main' : 'error.main'}
            >
              {formatCurrency(metrics.balance)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Transacciones Recientes
        </Typography>
        {metrics.recentTransactions.length > 0 ? (
          <Card>
            <CardContent>
              {metrics.recentTransactions.map((transaction) => (
                <Box 
                  key={transaction.id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {transaction.description || 'Sin descripción'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(transaction.date).toLocaleDateString()} - {transaction.category?.name || 'Sin categoría'}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    color={transaction.amount > 0 ? 'success.main' : 'error.main'}
                  >
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">No hay transacciones recientes</Alert>
        )}
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Categorías Principales
        </Typography>
        {metrics.topCategories.length > 0 ? (
          <Card>
            <CardContent>
              {metrics.topCategories.map((category) => (
                <Box 
                  key={category.id} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} transacciones
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="error.main">
                    {formatCurrency(category.total)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">No hay categorías para mostrar</Alert>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard; 