import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import { Category } from '../../../types/dashboard.types';

interface CategoriesListProps {
  categories: Category[];
  formatCurrency: (amount: number) => string;
}

/**
 * Componente que muestra la lista de categorías principales
 */
const CategoriesList = ({ categories, formatCurrency }: CategoriesListProps) => {
  if (!categories || categories.length === 0) {
    return <Alert severity="info">No hay categorías para mostrar</Alert>;
  }

  return (
    <Card>
      <CardContent>
        {categories.map((category) => (
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
  );
};

export default CategoriesList; 