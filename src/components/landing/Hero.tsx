import React from "react"
import { Button } from "../ui/Button"
import { DashboardPreview } from "./DashboardPreview"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-600 py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Maneja tus finanzas de forma{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300">
                inteligente
              </span>
            </h1>

            <p className="text-lg text-blue-100 max-w-lg">
              Con EDmoney puedes controlar tus ingresos y gastos fácilmente,
              establecer metas financieras y tomar el control de tu dinero.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button href="/registro" variant="secondary">
                Comenzar Gratis
              </Button>
              <Button href="#caracteristicas" variant="outline">
                Descubrir más
              </Button>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </div>
    </section>
  )
}
