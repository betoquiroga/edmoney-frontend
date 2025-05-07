import Link from "next/link"
import { CommandLineIcon } from "@heroicons/react/24/outline"

const PromptOptionCard = () => {
  return (
    <Link href="/transacciones/nueva/prompt" className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
          <CommandLineIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Prompt
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Escribe la descripción de tu transacción y la crearemos por ti
        </p>
      </div>
    </Link>
  )
}

export default PromptOptionCard
