/**
 * Formatea un número como moneda (USD).
 * @param amount Cantidad a formatear
 * @returns Texto formateado como moneda
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Formatea una fecha a formato local para mostrar.
 * @param date Fecha a formatear
 * @returns Texto de fecha formateado
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}; 