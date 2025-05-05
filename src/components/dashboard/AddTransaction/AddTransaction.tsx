import { AddTransactionProps } from "./types"

const AddTransaction = ({ onAddTransaction }: AddTransactionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-700">
          Añadir Transacción
        </h3>
      </div>

      <div className="p-6 space-y-4">
        <button
          onClick={() => onAddTransaction()}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
        >
          <span className="mr-2">
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
          Nuevo Ingreso
        </button>

        <button
          onClick={() => onAddTransaction()}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center"
        >
          <span className="mr-2">
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
          Nuevo Egreso
        </button>

        <div className="relative mt-6">
          <div className="flex items-center py-3 px-4 border border-gray-300 rounded-md">
            <input
              type="text"
              placeholder="Añadir rápido (ej: -$25 comida)"
              className="flex-grow text-sm text-gray-600 focus:outline-none"
            />
            <button className="text-blue-600 ml-2">
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
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTransaction
