import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import { Transaction } from '../../../types/dashboard.types';

interface TransactionsListProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
}

/**
 * Componente que muestra la lista de transacciones recientes
 */
const TransactionsList = ({ transactions, formatCurrency }: TransactionsListProps) => {
  if (!transactions || transactions.length === 0) {
    return <Alert severity="info">No hay transacciones recientes</Alert>;
  }

  return (
    <Card>
      <CardContent>
        {transactions.map((transaction) => (
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
  );
};

export default TransactionsList; 