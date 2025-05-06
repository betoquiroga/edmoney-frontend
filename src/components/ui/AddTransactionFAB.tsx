"use client"

import { FloatingActionButton } from "./FloatingActionButton"
import { useRouter } from "next/navigation"
import { DocumentTextIcon, SparklesIcon } from "@heroicons/react/24/outline"

export function AddTransactionFAB() {
  const router = useRouter()

  const options = [
    {
      id: "form",
      label: "Formulario",
      icon: <DocumentTextIcon className="h-5 w-5" />,
      onClick: () => {
        // Navegar al formulario de transacción
        router.push("/transacciones/nueva/formulario")
      },
    },
    {
      id: "ai-prompt",
      label: "IA Prompt",
      icon: <SparklesIcon className="h-5 w-5" />,
      onClick: () => {
        router.push("/transacciones/nueva/prompt")
      },
    },
  ]

  return <FloatingActionButton options={options} />
}
