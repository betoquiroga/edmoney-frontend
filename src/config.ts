/**
 * Configuración global de la aplicación
 */

// URL de la API - El backend corre en puerto 4001 sin "/api" al final
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Otras configuraciones globales
export const DEFAULT_CURRENCY = 'USD';
export const APP_NAME = 'EdMoney'; 