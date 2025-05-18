import { Box, Card, CardContent, Typography } from '@mui/material';

interface MetricsCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  formatCurrency: (amount: number) => string;
}

/**
 * Componente que muestra las tarjetas de métricas principales 
 * (Ingresos, Gastos, Balance)
 */
const MetricsCards = ({ 
  totalIncome, 
  totalExpense, 
  balance, 
  formatCurrency 
}: MetricsCardsProps) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            Ingresos Totales
          </Typography>
          <Typography variant="h5" component="div" color="success.main">
            {formatCurrency(totalIncome)}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            Gastos Totales
          </Typography>
          <Typography variant="h5" component="div" color="error.main">
            {formatCurrency(totalExpense)}
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
            color={balance >= 0 ? 'success.main' : 'error.main'}
          >
            {formatCurrency(balance)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MetricsCards; 