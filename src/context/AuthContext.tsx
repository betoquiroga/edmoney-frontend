'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { API_URL } from '../config'

// Definición de los tipos de usuario y contexto
interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUserState: () => boolean
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para obtener el usuario del localStorage y actualizar el estado
  // La convertimos en useCallback para evitar recreaciones innecesarias
  const refreshUserState = useCallback((): boolean => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      console.log('Auth state check - Token exists:', !!token)
      console.log('Auth state check - User exists:', !!storedUser)
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('User loaded from localStorage:', parsedUser)
          
          if (parsedUser && parsedUser.id) {
            // Solo actualizar el estado si es diferente al estado actual
            if (!user || user.id !== parsedUser.id) {
              setUser(parsedUser)
            }
            return true
          } else {
            console.error('User data is invalid:', parsedUser)
            // Datos de usuario inválidos
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (user !== null) {
              setUser(null)
            }
            return false
          }
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError)
          // Error al procesar JSON de usuario
          localStorage.removeItem('user')
          if (user !== null) {
            setUser(null)
          }
          return false
        }
      } else {
        // No hay token o usuario almacenados
        if (user !== null) {
          setUser(null)
        }
        return false
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (user !== null) {
        setUser(null)
      }
      return false
    }
  }, [user])

  // Cargar datos del usuario desde localStorage al inicio
  useEffect(() => {
    const checkAuth = async () => {
      refreshUserState()
      setIsLoading(false)
    }
    
    checkAuth()
  }, [refreshUserState])

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Hacer la llamada real a la API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión')
      }
      
      console.log('Login successful, received user data:', data.user)
      
      // Almacenar el token y datos del usuario
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setUser(data.user)
      
      return true
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Función para cerrar sesión
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Opcional: Invalidar el token en el backend
      const token = localStorage.getItem('token')
      if (token) {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        } catch (e) {
          // Si falla la llamada API, igual continuamos con el logout local
          console.warn('Error al cerrar sesión en el servidor:', e)
        }
      }
      
      // Limpiar almacenamiento local
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUserState
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 