import React from "react"

export function DashboardPreview() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-blue-800/20 rounded-lg blur-xl transform -rotate-6 scale-105"></div>
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border-t border-white/30">
        <div className="bg-blue-700 p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-white font-medium text-sm">Dashboard</div>
          <div></div>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="text-gray-500 text-xs uppercase font-medium mb-2">
              Saldo Actual
            </h3>
            <div className="flex items-baseline mb-4">
              <span className="text-blue-700 text-2xl font-bold mr-1">$</span>
              <span className="text-blue-700 text-2xl font-bold">2,547.63</span>
              <span className="text-blue-700 text-xl font-bold ml-2">USD</span>
            </div>
            <div className="flex mt-3">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs text-green-800 bg-green-100">
                ↑ 12.5% vs mes anterior
              </span>
            </div>
          </div>

          <div className="flex space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-md flex items-center justify-center flex-1">
              <span className="text-green-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </span>
            </div>
            <div className="bg-red-100 p-3 rounded-md flex items-center justify-center flex-1">
              <span className="text-red-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
                  🏠
                </div>
                <div>
                  <div className="text-sm font-medium">Alquiler</div>
                  <div className="text-xs text-gray-500">Vivienda</div>
                </div>
              </div>
              <div className="text-red-600 font-medium">-$450.00</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-3">
                  💰
                </div>
                <div>
                  <div className="text-sm font-medium">Salario</div>
                  <div className="text-xs text-gray-500">Ingresos</div>
                </div>
              </div>
              <div className="text-green-600 font-medium">+$2,500.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
