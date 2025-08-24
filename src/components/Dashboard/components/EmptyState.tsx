import { Container, Alert } from '@mui/material';

/**
 * Componente para mostrar cuando no hay datos disponibles en el dashboard
 */
const EmptyState = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="info">No hay datos disponibles para mostrar.</Alert>
    </Container>
  );
};

export default EmptyState; 