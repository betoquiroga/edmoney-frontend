import { API_URL } from '../config';

/**
 * Obtiene los headers para una solicitud autenticada
 * @returns Headers con el token de autenticación
 */
export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Añadir token de autenticación si existe
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Realiza una petición con control de timeout
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as any).name === 'AbortError') {
      throw new Error('La solicitud tomó demasiado tiempo. Por favor intente nuevamente.');
    }
    
    throw error;
  }
};

/**
 * Procesa la respuesta de error
 */
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `Error en la solicitud: ${response.status}`;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
    
    // Manejar errores específicos
    if (response.status === 401) {
      // Si es un error de autenticación, redirigir al login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir solo si no estamos ya en la página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
    }
  } catch (e) {
    // Si falla al parsear el JSON, usar el mensaje genérico
  }
  
  throw new Error(errorMessage);
};

/**
 * Realiza una solicitud GET autenticada
 * @param endpoint Endpoint de la API
 * @returns Respuesta de la solicitud
 */
export const authenticatedGet = async <T>(endpoint: string): Promise<T> => {
  try {
    console.log(`API Request to: ${API_URL}${endpoint}`);
    const headers = getAuthHeaders();
    console.log('Headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer [FILTERED]' : 'None' });
    
    const response = await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: 'GET',
        headers: headers,
      }
    );
    
    if (!response.ok) {
      console.error(`Error response: ${response.status} ${response.statusText}`);
      await handleApiError(response);
    }
    
    const data = await response.json();
    console.log(`API Response for ${endpoint}:`, data);
    
    // Validación básica de la respuesta
    if (data === null || data === undefined) {
      console.warn(`La respuesta para ${endpoint} es nula o indefinida`);
    } else if (Array.isArray(data)) {
      console.log(`Respuesta es un array con ${data.length} elementos`);
    } else if (typeof data === 'object') {
      console.log(`Respuesta es un objeto con propiedades: ${Object.keys(data).join(', ')}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error en la solicitud GET a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Realiza una solicitud POST autenticada
 * @param endpoint Endpoint de la API
 * @param data Datos a enviar
 * @returns Respuesta de la solicitud
 */
export const authenticatedPost = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud POST:', error);
    throw error;
  }
};

/**
 * Realiza una solicitud PATCH autenticada
 * @param endpoint Endpoint de la API
 * @param data Datos a enviar
 * @returns Respuesta de la solicitud
 */
export const authenticatedPatch = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud PATCH:', error);
    throw error;
  }
};

/**
 * Realiza una solicitud DELETE autenticada
 * @param endpoint Endpoint de la API
 * @returns Respuesta de la solicitud
 */
export const authenticatedDelete = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}${endpoint}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud DELETE:', error);
    throw error;
  }
}; 