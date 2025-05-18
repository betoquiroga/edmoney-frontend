/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { transactionFormSchema, TransactionFormInputs } from "./types"
import FormInput from "../../../../components/ui/FormInput"
import FormSelect from "../../../../components/ui/FormSelect"
import FormDatePicker from "../../../../components/ui/FormDatePicker"
import FormCheckbox from "../../../../components/ui/FormCheckbox"
import { transactionsService } from "../../../../services/transactions.service"
import { useEffect, useState } from "react"
import { TransactionType } from "../../../../types/category.types"
import { CreateTransactionDto } from "../../../../types/transaction.types"
import { useAuth } from "../../../../context/AuthContext"
import { API_URL } from "../../../../config"
import { authenticatedGet } from "../../../../utils/api"

// Método de entrada para formulario manual e IA
const INPUT_METHOD_MANUAL_FORM = "cf547ff9-3b5b-4704-9c4a-80b631f62234" // Formulario manual
const INPUT_METHOD_AI = "2042fddf-8abf-4b4b-a4bb-eafc4978e921" // IA

const TransactionForm = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Estado para almacenar categorías y métodos de pago
  const [categories, setCategories] = useState<Array<{value: string, label: string}>>([])
  const [paymentMethods, setPaymentMethods] = useState<Array<{value: string, label: string}>>([])
  const [inputMethods, setInputMethods] = useState<Array<{value: string, label: string}>>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  
  // Importar los servicios directamente aquí para usarlos
  const { categoriesService } = require("../../../../services/categories.service");
  const { paymentMethodsService } = require("../../../../services/payment-methods.service");
  
  // Log para verificar si hay datos quemados
  useEffect(() => {
    console.log("Estado de categorías cuando cambia:", categories);
  }, [categories]);
  
  useEffect(() => {
    console.log("Estado de métodos de pago cuando cambia:", paymentMethods);
  }, [paymentMethods]);
  
  // Obtener categorías y métodos de pago de la API utilizando métodos directos
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return
      
      setIsLoadingData(true)
      setErrorMessage(null)
      
      try {
        console.log("Obteniendo categorías y métodos de pago con métodos directos");
        
        // Usar los métodos directos que creamos
        const [categoriesData, paymentMethodsData] = await Promise.all([
          categoriesService.findAllDirect(),
          paymentMethodsService.findAllDirect()
        ]);
        
        console.log("Categorías obtenidas directamente:", categoriesData);
        console.log("Métodos de pago obtenidos directamente:", paymentMethodsData);
        
        if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
          console.warn("No se encontraron categorías en la respuesta de la API");
        }
        
        if (!Array.isArray(paymentMethodsData) || paymentMethodsData.length === 0) {
          console.warn("No se encontraron métodos de pago en la respuesta de la API");
        }
        
        // Procesar categorías
        const formattedCategories = (Array.isArray(categoriesData) ? categoriesData : []).map((cat: {id: string, name: string}) => ({
          value: cat.id,
          label: cat.name
        }));
        console.log("Categorías formateadas para el select:", formattedCategories);
        setCategories(formattedCategories);
        
        // Procesar métodos de pago
        const formattedPaymentMethods = (Array.isArray(paymentMethodsData) ? paymentMethodsData : []).map((pm: {id: string, name: string}) => ({
          value: pm.id,
          label: pm.name
        }));
        console.log("Métodos de pago formateados para el select:", formattedPaymentMethods);
        setPaymentMethods(formattedPaymentMethods);
        
        // Obtener métodos de entrada usando fetch directo
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No hay token de autenticación");
        }
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_URL;
        const inputMethodsResponse = await fetch(`${apiUrl}/input-methods`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!inputMethodsResponse.ok) {
          throw new Error(`Error al obtener métodos de entrada: ${inputMethodsResponse.status}`);
        }
        
        const inputMethodsData = await inputMethodsResponse.json();
        console.log("Métodos de entrada obtenidos:", inputMethodsData);
        
        // Procesar métodos de entrada
        if (Array.isArray(inputMethodsData)) {
          const formattedInputMethods = inputMethodsData.map(im => ({
            value: im.id,
            label: im.name
          }));
          console.log("Métodos de entrada formateados:", formattedInputMethods);
          setInputMethods(formattedInputMethods);
        } else if (inputMethodsData && typeof inputMethodsData === 'object' && 'inputMethods' in inputMethodsData) {
          const formattedInputMethods = inputMethodsData.inputMethods.map((im: any) => ({
            value: im.id,
            label: im.name
          }));
          console.log("Métodos de entrada formateados desde objeto:", formattedInputMethods);
          setInputMethods(formattedInputMethods);
        } else {
          console.error("Formato inesperado de métodos de entrada:", inputMethodsData);
          setInputMethods([]);
        }
      } catch (error) {
        console.error("Error al obtener datos para el formulario:", error);
        setErrorMessage(`Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchData();
  }, [user?.id]);

  // Verificar que no haya datos quemados
  const transactionTypes = [
    { value: TransactionType.INCOME, label: "Ingreso" },
    { value: TransactionType.EXPENSE, label: "Gasto" },
    { value: TransactionType.TRANSFER, label: "Transferencia" },
  ]

  const currencies = [
    { value: "USD", label: "USD - Dólar estadounidense" },
    { value: "EUR", label: "EUR - Euro" },
    { value: "MXN", label: "MXN - Peso mexicano" },
  ]

  // Obtener la fecha y hora actual en formato ISO para el valor por defecto
  const getCurrentDateTimeString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Actualizar values del formulario cuando el usuario cambia
  useEffect(() => {
    if (user?.id) {
      reset({
        ...getValues(),
        userId: user.id,
        inputMethodId: INPUT_METHOD_MANUAL_FORM // Usar el ID del formulario manual por defecto
      })
    }
  }, [user?.id])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset
  } = useForm<TransactionFormInputs>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      userId: user?.id || '', // ID real del usuario
      inputMethodId: INPUT_METHOD_MANUAL_FORM, // Usar el ID del formulario manual por defecto
      type: TransactionType.EXPENSE,
      currency: "USD",
      transactionDate: getCurrentDateTimeString(),
      isRecurring: false,
    },
  })

  // Para debug - mostrar valores en tiempo real
  const watchedValues = watch()
  console.log("Valores actuales del formulario:", watchedValues)

  // Verificar en cada renderizado el estado de categorías y métodos de pago
  console.log("Renderizando TransactionForm con categorías:", categories);
  console.log("Renderizando TransactionForm con métodos de pago:", paymentMethods);

  const createTransaction = useMutation({
    mutationFn: async (data: any) => {
      // Convert to API format
      const apiData: CreateTransactionDto = {
        user_id: data.userId,
        category_id: data.categoryId,
        payment_method_id: data.paymentMethodId,
        input_method_id: data.inputMethodId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        transaction_date: data.transactionDate,
        description: data.description,
        is_recurring: data.isRecurring,
        recurring_id: data.recurringId,
      }

      console.log("Enviando datos a la API:", apiData)
      try {
        const result = await transactionsService.create(apiData)
        console.log("Respuesta de la API:", result)
        return result
      } catch (error) {
        console.error("Error en la llamada a la API:", error)
        throw error
      }
    },
    onSuccess: () => {
      console.log("Transacción creada exitosamente, redirigiendo...")
      router.push("/transacciones")
    },
    onError: (error: any) => {
      console.error("Error creating transaction:", error)
      setErrorMessage(
        error?.message ||
          "Error al crear la transacción. Verifica los datos e intenta nuevamente."
      )
      setIsSubmitting(false)
    },
  })

  const onSubmit = (data: TransactionFormInputs) => {
    console.log("Formulario enviado con datos:", data)
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      // Validar que tenemos un usuario identificado
      if (!user?.id) {
        throw new Error("Necesitas iniciar sesión para crear una transacción")
      }
      
      // Asegurar que el ID de usuario es correcto
      data.userId = user.id
      
      // Enviar los datos
      createTransaction.mutate(data)
    } catch (error: any) {
      console.error("Error al procesar el formulario:", error)
      setErrorMessage(
        error?.errors?.[0]?.message ||
          error?.message ||
          "Error al procesar el formulario"
      )
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoadingData) {
    return (
      <div className="py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300">Cargando datos...</p>
      </div>
    )
  }
  
  // Mostrar advertencia si las categorías o métodos de pago están vacíos
  if ((categories.length === 0 || paymentMethods.length === 0) && !errorMessage) {
    return (
      <div className="py-10">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded mb-4">
          <p className="font-bold">Advertencia:</p>
          <p>No se pudieron cargar {categories.length === 0 ? 'las categorías' : 'los métodos de pago'} necesarios para este formulario.</p>
          <p className="mt-2">Detalles:</p>
          <ul className="list-disc ml-5 mt-1">
            <li>Categorías cargadas: {categories.length}</li>
            <li>Métodos de pago cargados: {paymentMethods.length}</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(categories.length === 0 || paymentMethods.length === 0) && (
        <div className="p-4 mb-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800">
            Advertencia: No se pudieron cargar las categorías o métodos de pago necesarios.
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Este formulario requiere datos que no se pudieron cargar correctamente.</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Categorías cargadas: {categories.length}</li>
              <li>Métodos de pago cargados: {paymentMethods.length}</li>
            </ul>
            {errorMessage && (
              <p className="mt-2 text-red-600">
                Detalles del error: {errorMessage}
              </p>
            )}
            <button
              onClick={() => {
                const fetchDataAgain = async () => {
                  if (!user?.id) return;
                  
                  setIsLoadingData(true);
                  setErrorMessage(null);
                  
                  try {
                    console.log("Reintentando obtener categorías y métodos de pago...");
                    
                    const token = localStorage.getItem('token');
                    if (!token) {
                      throw new Error("No hay token de autenticación");
                    }
                    
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || API_URL;
                    
                    // Intentar obtener categorías directamente con fetch
                    const categoriesResponse = await fetch(`${apiUrl}/categories`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    if (!categoriesResponse.ok) {
                      throw new Error(`Error al obtener categorías: ${categoriesResponse.status}`);
                    }
                    
                    const categoriesData = await categoriesResponse.json();
                    console.log("Respuesta sin procesar de categorías:", categoriesData);
                    
                    let processedCategories = [];
                    if (Array.isArray(categoriesData)) {
                      processedCategories = categoriesData;
                    } else if (categoriesData && typeof categoriesData === 'object' && 'categories' in categoriesData) {
                      processedCategories = categoriesData.categories;
                    }
                    
                    // Procesar categorías
                    const formattedCategories = processedCategories.map((cat: {id: string, name: string}) => ({
                      value: cat.id,
                      label: cat.name
                    }));
                    console.log("Categorías formateadas para el select:", formattedCategories);
                    setCategories(formattedCategories);
                    
                    // Intentar obtener métodos de pago directamente con fetch
                    const paymentMethodsResponse = await fetch(`${apiUrl}/payment-methods`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    if (!paymentMethodsResponse.ok) {
                      throw new Error(`Error al obtener métodos de pago: ${paymentMethodsResponse.status}`);
                    }
                    
                    const paymentMethodsData = await paymentMethodsResponse.json();
                    console.log("Respuesta sin procesar de métodos de pago:", paymentMethodsData);
                    
                    let processedPaymentMethods = [];
                    if (Array.isArray(paymentMethodsData)) {
                      processedPaymentMethods = paymentMethodsData;
                    } else if (paymentMethodsData && typeof paymentMethodsData === 'object' && 'paymentMethods' in paymentMethodsData) {
                      processedPaymentMethods = paymentMethodsData.paymentMethods;
                    }
                    
                    // Procesar métodos de pago
                    const formattedPaymentMethods = processedPaymentMethods.map((pm: {id: string, name: string}) => ({
                      value: pm.id,
                      label: pm.name
                    }));
                    console.log("Métodos de pago formateados para el select:", formattedPaymentMethods);
                    setPaymentMethods(formattedPaymentMethods);
                    
                  } catch (error) {
                    console.error("Error al reintenter la carga de datos:", error);
                    setErrorMessage(`Error al recargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                  } finally {
                    setIsLoadingData(false);
                  }
                };
                
                fetchDataAgain();
              }}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={isLoadingData}
            >
              {isLoadingData ? "Cargando..." : "Reintentar carga de datos"}
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="type"
            label="Tipo de transacción"
            options={transactionTypes}
            register={register("type")}
            error={errors.type}
            required
          />

          <FormInput
            id="amount"
            label="Monto"
            type="number"
            placeholder="0.00"
            register={register("amount")}
            error={errors.amount}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="currency"
            label="Moneda"
            options={currencies}
            register={register("currency")}
            error={errors.currency}
            required
          />

          <FormDatePicker
            id="transactionDate"
            label="Fecha y hora"
            register={register("transactionDate")}
            error={errors.transactionDate}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            id="categoryId"
            label="Categoría"
            options={categories}
            register={register("categoryId")}
            error={errors.categoryId}
          />

          <FormSelect
            id="paymentMethodId"
            label="Método de pago"
            options={paymentMethods}
            register={register("paymentMethodId")}
            error={errors.paymentMethodId}
          />
        </div>

        <FormInput
          id="description"
          label="Descripción"
          placeholder="Describe tu transacción"
          register={register("description")}
          error={errors.description}
        />

        <FormCheckbox
          id="isRecurring"
          label="¿Es una transacción recurrente?"
          register={register("isRecurring")}
          error={errors.isRecurring}
        />

        {/* Input oculto para el ID de usuario */}
        <input type="hidden" {...register("userId")} />
        
        {/* Input oculto para el método de entrada */}
        <input type="hidden" {...register("inputMethodId")} />

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar transacción"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
