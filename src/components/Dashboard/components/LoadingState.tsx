import { Container, CircularProgress } from '@mui/material';

/**
 * Componente para mostrar el estado de carga del dashboard
 */
const LoadingState = () => {
  return (
    <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Container>
  );
};

export default LoadingState; 