"use client"

import React, { useEffect, useState } from 'react'
import Dashboard from '../../components/Dashboard'
import { Box } from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

/**
 * Página principal del dashboard
 */
export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)

  // Verificar autenticación solo una vez al cargar la página
  useEffect(() => {
    // Solo ejecutar si no hemos verificado todavía y la carga de autenticación está completa
    if (!authChecked && !isLoading) {
      setAuthChecked(true)
      
      // Si no está autenticado, redirigir al login
      if (!isAuthenticated) {
        console.log('No autenticado, redirigiendo al login desde DashboardPage')
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router, authChecked])

  return (
    <Box>
      <Dashboard />
    </Box>
  )
}
