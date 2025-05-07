import React from "react"
import { Button } from "../ui/Button"
import { FeatureCard } from "./FeatureCard"

export function Features() {
  return (
    <section
      id="caracteristicas"
      className="py-16 md:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Características principales
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            EDmoney te ofrece todo lo que necesitas para gestionar tus finanzas
            personales de manera eficiente y sencilla.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"></path>
              </svg>
            }
            title="Registro rápido"
            description="Registra tus ingresos y gastos de forma rápida con nuestro sistema inteligente de reconocimiento."
          />

          <FeatureCard
            icon={
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
            }
            title="Informes detallados"
            description="Visualiza informes detallados de tu situación financiera con gráficos claros y completos."
            bgColor="bg-green-100 dark:bg-green-900/40"
            iconColor="text-green-700 dark:text-green-400"
          />

          <FeatureCard
            icon={
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5z"></path>
                <path d="M5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z"></path>
                <path d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5z"></path>
                <path d="M11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            }
            title="Categorías inteligentes"
            description="Organiza tus finanzas con categorías inteligentes que te ayudan a entender tus hábitos de gasto."
            bgColor="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-700 dark:text-purple-400"
          />

          <FeatureCard
            icon={
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"></path>
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z"></path>
                <circle cx="5" cy="5" r="2"></circle>
              </svg>
            }
            title="Metas financieras"
            description="Establece y alcanza tus metas financieras con nuestro sistema de seguimiento y proyecciones."
            bgColor="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-700 dark:text-orange-400"
          />
        </div>

        <div className="text-center mt-16">
          <Button href="/registro" variant="primary">
            Empieza ahora mismo
          </Button>
        </div>
      </div>
    </section>
  )
}
