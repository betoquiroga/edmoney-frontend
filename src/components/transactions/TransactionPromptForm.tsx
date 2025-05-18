import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { transactionsService } from "@/services/transactions.service"
import { TransactionPromptResponse } from "@/types/transaction-prompt.types"
import { useState, useRef, ChangeEvent, DragEvent, useEffect, useCallback } from "react"
import { useUser } from "../layout/DashboardLayout"
import { debounce } from "lodash"
import { useMutation } from "@tanstack/react-query"

const promptSchema = z.object({
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
})

type PromptFormValues = z.infer<typeof promptSchema>

interface TransactionPromptFormProps {
  onResponse: (response: TransactionPromptResponse) => void
  setLoading: (loading: boolean) => void
}

// Detect iOS device
const isIOS = () => {
  return (
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
  )
}

// Añadir la definición de textAreaClasses
const textAreaClasses = "w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"

export function TransactionPromptForm({
  onResponse,
  setLoading,
}: TransactionPromptFormProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isAudioContextReady, setIsAudioContextReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useUser()
  const audioRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const isIOSDevice = useRef<boolean>(false)
  
  // Inicializar estados con valores almacenados localmente si existen
  const [messageValue, setMessageValue] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transcribedText') || "";
    }
    return "";
  });
  
  const messageValueRef = useRef<string>("")
  const [transcribedText, setTranscribedText] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('transcribedText') || "";
    }
    return "";
  });
  
  // Guardar el valor transcrito en localStorage cuando cambie
  useEffect(() => {
    if (transcribedText && typeof window !== 'undefined') {
      localStorage.setItem('transcribedText', transcribedText);
    }
  }, [transcribedText]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      isIOSDevice.current = isIOS()
    }
  }, [])

  // Initialize audio context on iOS devices within a user gesture
  const initAudioContext = () => {
    if (
      typeof window !== "undefined" &&
      isIOSDevice.current &&
      !audioContextRef.current
    ) {
      try {
        // Create AudioContext on iOS only in response to a user gesture
        type AudioContextType = typeof window.AudioContext
        interface WindowWithWebkitAudio extends Window {
          webkitAudioContext?: AudioContextType
        }
        const AudioContextConstructor: AudioContextType =
          window.AudioContext ||
          ((window as WindowWithWebkitAudio)
            .webkitAudioContext as AudioContextType)
        audioContextRef.current = new AudioContextConstructor()

        // Some iOS versions require an additional step to "unlock" the audio context
        if (audioContextRef.current.state === "suspended") {
          const unlock = () => {
            // Create and play a silent buffer to unlock the audio context
            const buffer = audioContextRef.current!.createBuffer(1, 1, 22050)
            const source = audioContextRef.current!.createBufferSource()
            source.buffer = buffer
            source.connect(audioContextRef.current!.destination)
            source.start(0)

            // Resume the audio context (needed for iOS)
            audioContextRef.current!.resume().then(() => {
              setIsAudioContextReady(true)
              console.log("AudioContext is now ready")
            })

            // Remove the event listeners once used
            document.body.removeEventListener("touchstart", unlock)
            document.body.removeEventListener("touchend", unlock)
            document.body.removeEventListener("click", unlock)
          }

          document.body.addEventListener("touchstart", unlock, false)
          document.body.addEventListener("touchend", unlock, false)
          document.body.addEventListener("click", unlock, false)
        } else {
          setIsAudioContextReady(true)
        }
      } catch (err) {
        console.error("Error initializing AudioContext:", err)
      }
    } else {
      // On non-iOS devices, mark as ready immediately
      setIsAudioContextReady(true)
    }
  }

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

          // Initialize audio context for iOS devices (will be activated on user gesture)
          if (isIOSDevice.current) {
            // Will be unlocked on user action
            console.log(
              "iOS device detected, audio context will be initialized on user gesture",
            )
          } else {
            // Mark as ready for non-iOS devices
            setIsAudioContextReady(true)
          }
        })
        .catch((err) => {
          console.error("Failed to load audio recorder polyfill:", err)
          // Still mark as ready to avoid blocking UI
          setIsAudioContextReady(true)
        })
    }
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      message: "",
    },
  })

  // Registrar el textarea y sincronizar el ref
  const { ref, ...registerProps } = register("message");
  
  // Guardar el valor en el ref cada vez que cambie messageValue
  useEffect(() => {
    messageValueRef.current = messageValue;
    
    // Sincronizar el valor con el textarea si existe
    if (textareaRef.current) {
      textareaRef.current.value = messageValue;
    }
    
    // También actualizar el valor en el formulario
    setValue("message", messageValue);
  }, [messageValue, setValue]);

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

  const prepareRecording = () => {
    // Initialize audio context if on iOS
    if (isIOSDevice.current) {
      initAudioContext()
      if (!isAudioContextReady) {
        // If the audio context isn't ready yet, this will have triggered the unlock process
        console.log("Audio context not ready yet, initialized unlock process")
        return
      }
    }

    // If we're here, either it's not iOS or the audio context is ready
    startRecording()
  }

  const startRecording = async () => {
    try {
      // Reset the recording state
      setRecordingTime(0)
      audioChunks.current = []

      // Request permission to use the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Additional iOS-specific handling to ensure audio context is ready
      if (
        isIOSDevice.current &&
        audioContextRef.current &&
        audioContextRef.current.state !== "running"
      ) {
        try {
          await audioContextRef.current.resume()
        } catch (e) {
          console.error("Failed to resume audio context:", e)
        }
      }

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

      // Create and set up the recorder
      const recorder = new MediaRecorder(stream, { mimeType })
      audioRecorder.current = recorder

      // Set up event handlers
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data)
        }
      }

      recorder.onstop = () => {
        // Create a blob from all chunks
        const blob = new Blob(audioChunks.current, { type: mimeType })
        handleStopRecording(blob)

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      // Start recording
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error starting recording:", err)
      alert("No se pudo acceder al micrófono. Verifica los permisos.")
    }
  }

  const stopRecording = () => {
    if (audioRecorder.current && isRecording) {
      audioRecorder.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileChange = (file: File) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        alert("Por favor, selecciona una imagen válida (JPEG, PNG o GIF)")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setImageBase64(base64)
        setImageName(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileChange(file)
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
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileChange(file)
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

  // Crear la mutación para procesar la transacción con IA
  const createTransactionFromPromptMutation = useMutation({
    mutationFn: async ({
      message,
      imageBase64,
    }: {
      message: string
      imageBase64: string | null
    }) => {
      if (!user?.id) throw new Error("User not authenticated")
      
      // Obtener el token de autenticación
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No hay token de autenticación");
      
      console.log("Enviando prompt a la API con userId:", user.id);
      return transactionsService.createFromPrompt(user.id, message, imageBase64, token);
    },
    onSuccess: (data) => {
      // Convert TransactionResponse to TransactionPromptResponse
      onResponse({
        transaction: data.transaction,
        message: data.message || "Transacción procesada con éxito"
      })
    },
    onError: (error) => {
      console.error("Error en createFromPrompt:", error)
      onResponse({
        message: `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      })
    }
  })

  const handleMessageChange = (value: string) => {
    console.log("Actualizando valor a:", value);
    setMessageValue(value);
    messageValueRef.current = value;
    
    // Si el usuario modifica manualmente, también actualizar el valor transcrito
    // para evitar sobrescrituras
    setTranscribedText(value);
  }

  // Función para actualizar manualmente el textarea
  const updateTextarea = (text: string) => {
    console.log("Actualizando textarea manualmente con:", text);
    
    // Actualizar estados
    setMessageValue(text);
    messageValueRef.current = text;
    
    // Actualizar formulario
    setValue("message", text);
    
    // Actualizar DOM si el ref está disponible
    if (textareaRef.current) {
      textareaRef.current.value = text;
    }
  }

  const handleStopRecording = async (blob: Blob) => {
    try {
      if (!user?.id) throw new Error("User not authenticated")

      // Start loading state
      setLoading(true)

      // Convert blob to base64
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = async () => {
        const base64data = reader.result as string
        // Get only the base64 part, removing data:audio/webm;base64,
        const base64Audio = base64data.split(",")[1]

        try {
          console.log("Enviando audio para transcripción...");
          // Send to backend for transcription
          const transcription = await transactionsService.transcribeAudio(
            user.id,
            base64Audio
          )

          console.log("Respuesta de transcripción:", transcription);
          
          if (transcription && transcription.text) {
            const newTranscribedText = transcription.text;
            console.log("Texto transcrito:", newTranscribedText);
            
            // Guardar en localStorage primero para asegurar persistencia
            if (typeof window !== 'undefined') {
              localStorage.setItem('transcribedText', newTranscribedText);
              console.log("Texto guardado en localStorage");
            }
            
            // Establecer el valor en el textarea y el estado
            setMessageValue(newTranscribedText);
            setValue("message", newTranscribedText);
            
            // Desactivar el indicador de carga
            setLoading(false);
            
            // Dar tiempo para que la UI se actualice
            setTimeout(() => {
              // Si hay un elemento textarea, asegurar que tenga el valor correcto
              if (textareaRef.current) {
                textareaRef.current.value = newTranscribedText;
                console.log("Valor actualizado en textarea");
              }
            }, 50);
          } else {
            console.error("No se obtuvo texto de la transcripción:", transcription);
            alert("No se pudo transcribir el audio. Inténtalo de nuevo.")
            setLoading(false);
          }
        } catch (error) {
          console.error("Error transcribing audio:", error)
          alert("Error al procesar el audio. Inténtalo de nuevo.")
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error processing audio:", error)
      setLoading(false)
    }
  }

  const onSubmit = async (data: PromptFormValues) => {
    if (!user?.id) {
      alert("Debes iniciar sesión para usar esta función")
      return
    }

    // Usar el valor del ref como respaldo, o localStorage si todo falla
    const savedText = typeof window !== 'undefined' ? localStorage.getItem('transcribedText') : null;
    const finalMessage = data.message || messageValueRef.current || messageValue || transcribedText || savedText || "";

    console.log("Enviando datos al submit:", finalMessage);

    try {
      setLoading(true)
      await createTransactionFromPromptMutation.mutateAsync({
        message: finalMessage,
        imageBase64,
      })
      
      // Solo resetear después de una operación exitosa
      setValue("message", "")
      setImageBase64(null)
      setImageName(null)
      setMessageValue("")
      messageValueRef.current = "";
      setTranscribedText(""); 
      
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('transcribedText');
      }
    } catch (error) {
      console.error("Error creating transaction:", error)
      alert("Error al procesar la solicitud. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRecorder.current && isRecording) {
        audioRecorder.current.stop()
      }
    }
  }, [isRecording])

  // Sincronizar el messageValue con transcribedText para evitar sobrescrituras
  useEffect(() => {
    // Solo actualizar messageValue desde transcribedText si transcribedText tiene valor
    // y messageValue no lo tiene (o ha sido limpiado)
    if (transcribedText && (!messageValue || messageValue === "")) {
      console.log("Restaurando valor transcrito:", transcribedText);
      setMessageValue(transcribedText);
      setValue("message", transcribedText);
      
      // Actualizar directamente el textarea si está disponible
      if (textareaRef.current) {
        textareaRef.current.value = transcribedText;
        // Disparar un evento para que React detecte el cambio
        const event = new Event('input', { bubbles: true });
        textareaRef.current.dispatchEvent(event);
      }
    }
  }, [messageValue, transcribedText, setValue]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-full relative">
          <textarea
            id="message-textarea"
            {...registerProps}
            ref={(e) => {
              ref(e);
              textareaRef.current = e;
              
              // Si hay texto almacenado, aplicarlo después del montaje
              if (e && typeof window !== 'undefined') {
                const savedText = localStorage.getItem('transcribedText');
                if (savedText && !e.value) {
                  e.value = savedText;
                  
                  // Actualizar estados
                  setMessageValue(savedText);
                  setValue("message", savedText);
                  
                  // Disparar eventos
                  const event = new Event('input', { bubbles: true });
                  e.dispatchEvent(event);
                }
              }
            }}
            placeholder="Describe tu transacción... (ej: 'Pagué $50 de café en efectivo ayer')"
            rows={3}
            className={`${textAreaClasses} ${
              errors.message ? "border-red-500" : ""
            }`}
            value={messageValue}
            onChange={(e) => handleMessageChange(e.target.value)}
          />
          {/* Indicador para mostrar el texto transcrito y/o texto en localStorage */}
          <div id="transcription-display" className="text-xs text-gray-400 mt-1">
            Texto actual: <span className="font-medium">{messageValue || "(vacío)"}</span>
            {!messageValue && typeof window !== 'undefined' && localStorage.getItem('transcribedText') && (
              <button 
                type="button" 
                className="ml-2 text-blue-500 hover:text-blue-600"
                onClick={() => {
                  const savedText = localStorage.getItem('transcribedText') || "";
                  
                  // Restaurar desde localStorage
                  setMessageValue(savedText);
                  setValue("message", savedText);
                  
                  // Actualizar el textarea 
                  if (textareaRef.current) {
                    textareaRef.current.value = savedText;
                    textareaRef.current.focus();
                    
                    // Disparar eventos
                    const event = new Event('input', { bubbles: true });
                    textareaRef.current.dispatchEvent(event);
                  }
                }}
              >
                (Recuperar transcripción guardada)
              </button>
            )}
          </div>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Image Preview */}
        {imageBase64 && (
          <div className="relative mt-2 inline-block">
            <img
              src={imageBase64}
              alt="Preview"
              className="h-24 w-auto rounded-md object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              aria-label="Remove image"
            >
              ×
            </button>
            {imageName && (
              <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                {imageName}
              </p>
            )}
          </div>
        )}

        {/* File Drop Area */}
        {!imageBase64 && (
          <div
            className={`border-2 border-dashed ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700"
            } rounded-md p-4 text-center cursor-pointer transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Arrastra una imagen de la factura o{" "}
              <span className="text-blue-500">selecciona un archivo</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Soporta: JPG, PNG, GIF
            </p>
          </div>
        )}

        {/* Audio Recording Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <span className="inline-block w-3 h-3 rounded-full bg-white animate-pulse mr-2"></span>
                <span>{formatTime(recordingTime)}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={prepareRecording}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
                Dictar
              </button>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            disabled={createTransactionFromPromptMutation.isPending}
          >
            {createTransactionFromPromptMutation.isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : (
              "Crear transacción"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
