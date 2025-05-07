import React from "react"
import { PlanCard } from "./PlanCard"

export function Plans() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Planes sencillos y flexibles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Escoge el plan que mejor se adapte a tus necesidades y comienza a
            gestionar tus finanzas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <PlanCard
            name="Plan Free"
            price="$0"
            period="/mes"
            description="Perfecto para comenzar a gestionar tus finanzas personales."
            features={[
              { text: "Registro manual de transacciones" },
              { text: "Entrada por texto (IA)" },
              { text: "Dashboard básico" },
              { text: "Exportación a CSV" },
            ]}
            ctaText="Comenzar gratis"
            ctaLink="/registro"
          />

          {/* Pro Plan */}
          <PlanCard
            name="Plan Pro"
            price="$9.99"
            period="/mes"
            description="Todas las funciones para llevar tus finanzas al siguiente nivel."
            features={[
              { text: "Todo lo incluido en Plan Free" },
              { text: "Entrada por voz (próximamente)" },
              { text: "Entrada por imagen (próximamente)" },
              { text: "Reportes avanzados y proyecciones" },
              { text: "Soporte prioritario" },
            ]}
            ctaText="Comenzar prueba de 14 días"
            ctaLink="/registro"
            popular={true}
          />
        </div>
      </div>
    </section>
  )
}
