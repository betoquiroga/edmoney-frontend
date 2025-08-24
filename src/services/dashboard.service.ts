import { API_URL } from '../config';
import { MetricsData } from '../types';
import { authenticatedGet } from '../utils/api';

export class DashboardService {
  /**
   * Obtiene las métricas del dashboard
   * @param userId ID del usuario 
   * @param period Período a analizar (month, quarter, year, week)
   * @returns Datos de métricas del dashboard
   */
  static async getDashboardMetrics(
    userId: string,
    period: string = 'month'
  ): Promise<MetricsData> {
    if (!userId) {
      throw new Error("Se requiere el ID del usuario para obtener las métricas");
    }

    // Validar el período
    const validPeriods = ['week', 'month', 'quarter', 'year'];
    if (!validPeriods.includes(period)) {
      period = 'month'; // Usar el valor predeterminado si es inválido
    }

    try {
      console.log(`Solicitando métricas para usuario ${userId} y período: ${period}`);
      
      // Usar el helper de API autenticada con manejo de timeout integrado
      const data = await authenticatedGet<MetricsData>(`/metrics?period=${period}`);
      
      console.log('Respuesta del servidor:', data);
      
      return data;
    } catch (error: any) {
      console.error('Error en dashboard.service:', error);
      throw error;
    }
  }
} 