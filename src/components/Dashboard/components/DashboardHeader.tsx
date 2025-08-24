import { Box, Typography } from '@mui/material';
import PeriodSelector from './PeriodSelector';
import { SelectChangeEvent } from '@mui/material';

interface DashboardHeaderProps {
  period: string;
  onPeriodChange: (event: SelectChangeEvent) => void;
}

/**
 * Componente para el encabezado del dashboard que incluye el título y selector de período
 */
const DashboardHeader = ({ period, onPeriodChange }: DashboardHeaderProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3 
    }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <PeriodSelector period={period} onChange={onPeriodChange} />
    </Box>
  );
};

export default DashboardHeader; 