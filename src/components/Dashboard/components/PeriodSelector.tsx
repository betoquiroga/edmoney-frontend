import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface PeriodSelectorProps {
  period: string;
  onChange: (event: SelectChangeEvent) => void;
}

/**
 * Componente que muestra un selector de período para el dashboard
 */
const PeriodSelector = ({ period, onChange }: PeriodSelectorProps) => {
  return (
    <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="period-select-label">Período</InputLabel>
      <Select
        labelId="period-select-label"
        id="period-select"
        value={period}
        label="Período"
        onChange={onChange}
      >
        <MenuItem value="week">Semanal</MenuItem>
        <MenuItem value="month">Mensual</MenuItem>
        <MenuItem value="quarter">Trimestral</MenuItem>
        <MenuItem value="year">Anual</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PeriodSelector; 