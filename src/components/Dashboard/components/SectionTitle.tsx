import { Typography } from '@mui/material';

interface SectionTitleProps {
  title: string;
}

/**
 * Componente para mostrar el título de una sección del dashboard
 */
const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
  );
};

export default SectionTitle; 