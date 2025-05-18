import { Container, Alert, Box, Button } from '@mui/material';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

/**
 * Componente para mostrar estado de error en el dashboard
 */
const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{errorMessage}</Alert>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={onRetry}>
          Reintentar
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorState; 