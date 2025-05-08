import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { transactionsService } from "@/services/transactions.service"
import { TransactionPromptResponse } from "@/types/transaction-prompt.types"
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react"
import { useUser } from "../layout/DashboardLayout"

const promptSchema = z.object({
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
})

type PromptFormValues = z.infer<typeof promptSchema>

interface TransactionPromptFormProps {
  onResponse: (response: TransactionPromptResponse) => void
  setLoading: (loading: boolean) => void
}

export function TransactionPromptForm({
  onResponse,
  setLoading,
}: TransactionPromptFormProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useUser()
  const audioRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Dynamically import polyfill only on client side
  useEffect(() => {
    // Dynamic import of audio-recorder-polyfill - will only run on client
    if (typeof window !== "undefined") {
      import("audio-recorder-polyfill")
        .then((module) => {
          // After import, check if we need to use polyfill
          const isNativeSupported =
            window.MediaRecorder &&
            typeof window.MediaRecorder.isTypeSupported === "function" &&
            window.MediaRecorder.isTypeSupported("audio/webm")

          // If native is not supported, use polyfill
          if (!isNativeSupported && module.default) {
            window.MediaRecorder = module.default
          }
        })
        .catch((err) => {
          console.error("Failed to load audio recorder polyfill:", err)
        })
    }
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      message: "",
    },
  })

  // Effect to handle the recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  const startRecording = async () => {
    try {
      // Reset the recording state
      setRecordingTime(0)
      audioChunks.current = []

      // Request permission to use the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Determine best format based on browser support
      let mimeType = "audio/wav"
      if (
        typeof window !== "undefined" &&
        window.MediaRecorder &&
        window.MediaRecorder.isTypeSupported
      ) {
        if (window.MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm"
        } else if (window.MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4"
        } else if (window.MediaRecorder.isTypeSupported("audio/ogg")) {
          mimeType = "audio/ogg"
        }
      }

      // Create a new MediaRecorder instance with appropriate options
      const recorder = new MediaRecorder(stream, { mimeType })
      audioRecorder.current = recorder

      // Event handler for when data is available
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }

      // Event handler for when recording stops
      recorder.onstop = async () => {
        // Create a blob from the chunks
        const mimeType = recorder.mimeType || "audio/webm"
        const blob = new Blob(audioChunks.current, { type: mimeType })
        await handleStopRecording(blob)
      }

      // Start recording
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (audioRecorder.current && isRecording) {
      audioRecorder.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      if (audioRecorder.current.stream) {
        audioRecorder.current.stream
          .getTracks()
          .forEach((track) => track.stop())
      }
    }
  }

  const handleFileChange = (file: File) => {
    if (file) {
      setImageName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setImageBase64(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImageBase64(null)
    setImageName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const contextDefault = `<contexto> user_id: ${user?.id} Categorías disponibles: ID | name f47ac10b-58cc-4372-a567-0e02b2c3d479 | Alimentación 38c4e644-6c23-4b85-9cb4-93e0b91bab92 | Transporte 1a5f9851-53e1-4f0c-b8ad-76c6b8e4ff37 | Salario c71f23c1-4a09-4b8a-b866-4210b13ee7d8Entretenimiento db3eb5d3-86a6-4d1c-9ca6-6e98baa3d1e6 | Transferencia entre cuentas Payment methods disponibles: id | name eea04a3a-ab7d-46c4-b90e-4aa8f6c4284d | Cash ba384815-d670-47ea-bee1-f919995180ce | Credit Card 780e54f4-3a17-4de0-8645-425681bcd3f5 | Debit Card 51284ad5-0adc-473e-aa64-cc6dd78c03bd | Bank Transfer 30dd8a7f-cc49-490a-8b0a-855fb2d4451d | PayPal (Si el usuario no te dice el método, usa siempre Cash) input_method_id: 5df021e9-7955-49ba-9488-de9a21bc5eca Si el mensaje del usuario o la imagen adjunta no tiene fecha de transacción, usa la fecha actual: transaction_date: ${new Date().toISOString()} </contexto>`

  const onSubmit = async (data: PromptFormValues) => {
    try {
      setLoading(true)
      const response = await transactionsService.createFromPrompt(
        data.message,
        contextDefault,
        imageBase64 || undefined,
      )
      onResponse({
        transaction: response.transaction,
        message: response.message || "Transacción procesada",
      })
    } catch (error) {
      console.error("Error creating transaction from prompt:", error)
      onResponse({ message: "Error al procesar la transacción" })
    } finally {
      setLoading(false)
    }
  }

  // Event handler for when recording stops
  const handleStopRecording = async (blob: Blob) => {
    setLoading(true)
    try {
      // Transcribe the audio
      const text = await transactionsService.transcribeAudio(blob)

      // Set the transcribed text to the message field
      setValue("message", text, { shouldValidate: true })

      // Create a transaction using the transcribed text
      const response = await transactionsService.createFromPrompt(
        text,
        contextDefault,
        undefined,
      )

      // Process the response
      onResponse({
        transaction: response.transaction,
        message: response.message || "Transacción procesada desde audio",
      })
    } catch (error) {
      console.error("Error transcribing audio or creating transaction:", error)
      onResponse({ message: "Error al procesar la transacción de audio" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 dark:text-gray-200"
    >
      <div>
        <div className="mt-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`border-2 border-dashed rounded-md px-6 py-12 lg:py-28 text-center cursor-pointer transition mb-12 ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300/20 dark:border-gray-600/30 hover:border-blue-400 dark:hover:border-blue-500"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />

            {imageBase64 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <img
                    src={imageBase64}
                    alt="Vista previa"
                    className="max-h-40 max-w-full object-contain dark:border dark:border-gray-700 dark:rounded"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {imageName}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage()
                  }}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50"
                >
                  Remover imagen
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {isDragging
                    ? "Suelta la imagen aquí..."
                    : "Arrastra y suelta una imagen, o haz clic para seleccionar"}
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, GIF
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Describe tu transacción
          </label>
          <div className="ml-auto">
            {isRecording ? (
              <div className="flex items-center">
                <span className="text-red-500 dark:text-red-400 text-sm mr-2 animate-pulse">
                  Grabando {formatTime(recordingTime)}
                </span>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <textarea
          id="message"
          rows={3}
          className="w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Ej. Compré un café por $5.50 en la cafetería"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
        >
          Procesar transacción
        </button>
      </div>
    </form>
  )
}
