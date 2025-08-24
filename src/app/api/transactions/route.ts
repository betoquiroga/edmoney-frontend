/* eslint-disable camelcase */
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { ResponseInputMessageContentList } from "openai/resources/responses/responses.mjs"
import axios from "axios"

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// IDs de métodos de entrada para las transacciones
const INPUT_METHOD_MANUAL_FORM = "cf547ff9-3b5b-4704-9c4a-80b631f62234" // Formulario manual
const INPUT_METHOD_AI = "2042fddf-8abf-4b4b-a4bb-eafc4978e921" // IA

// Definir interfaces para categorías y métodos de pago para evitar errores del linter
interface Category {
  id: string;
  name: string;
  type: string;
  [key: string]: any; // Para permitir cualquier otra propiedad adicional
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  [key: string]: any; // Para permitir cualquier otra propiedad adicional
}

// Función auxiliar para obtener categorías y métodos de pago
async function fetchCategoriesAndPaymentMethods(userId: string, token: string): Promise<{
  categories: Category[];
  paymentMethods: PaymentMethod[];
}> {
  try {
    const API_URL = process.env.API_URL || 'http://localhost:4001';
    
    // Obtener categorías
    const categoriesResponse = await axios.get(`${API_URL}/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Obtener métodos de pago
    const paymentMethodsResponse = await axios.get(`${API_URL}/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Extraer categorías y métodos de pago
    let categories: Category[] = [];
    if (categoriesResponse.data.categories) {
      categories = categoriesResponse.data.categories;
    } else if (Array.isArray(categoriesResponse.data)) {
      categories = categoriesResponse.data;
    }
    
    let paymentMethods: PaymentMethod[] = [];
    if (paymentMethodsResponse.data.paymentMethods) {
      paymentMethods = paymentMethodsResponse.data.paymentMethods;
    } else if (Array.isArray(paymentMethodsResponse.data)) {
      paymentMethods = paymentMethodsResponse.data;
    }
    
    return { categories, paymentMethods };
  } catch (error) {
    console.error("Error obteniendo categorías y métodos de pago:", error);
    return { categories: [], paymentMethods: [] };
  }
}

export async function POST(request: Request) {
  try {
    // Extract the data from the request body
    const { userId, message, image, token } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: "Es necesario proporcionar el ID del usuario" },
        { status: 400 }
      )
    }

    if (!token) {
      return NextResponse.json(
        { message: "Es necesario proporcionar el token de autenticación" },
        { status: 400 }
      )
    }

    // Obtener categorías y métodos de pago del backend
    const { categories, paymentMethods } = await fetchCategoriesAndPaymentMethods(userId, token);

    // Formatear categorías para el prompt
    const formattedCategories = categories.map((cat: Category) => 
      `${cat.name} (${cat.type}): ${cat.id}`
    ).join('\n    ');

    // Formatear métodos de pago para el prompt
    const formattedPaymentMethods = paymentMethods.map((pm: PaymentMethod) => 
      `${pm.name} (${pm.type}): ${pm.id}`
    ).join('\n    ');

    // Generar contexto con userId, input_method_id, categorías y métodos de pago
    const context = `Información de la transacción:
    - user_id: ${userId}
    - input_method_id: ${INPUT_METHOD_AI}
    - transaction_date: ${new Date().toISOString()}

    Categorías disponibles:
    ${formattedCategories}

    Métodos de pago disponibles:
    ${formattedPaymentMethods}`;

    // Generate prompt with context and message
    const prompt = `CONTEXT: ${context}\n\nMESSAGE: ${message}`

    // Prepare user content array
    const userContent: ResponseInputMessageContentList = [
      {
        type: "input_text",
        text: prompt,
      },
    ]

    // Add image to user content if provided
    if (image) {
      userContent.push({
        type: "input_image",
        image_url: image,
        detail: "auto",
      })
    }

    // Call OpenAI API with the ResponsesAPI
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `Eres un asistente que a partir del mensaje que recibas del usuario devolverás un JSON con una estructura definida para poder almacenar esa información como una transacción en una aplicación de control de ingresos y gastos.
              Si el mensaje del usuario no se puede llevar al JSON que debes responder, ya sea porque falta información o porque el usuario mandó un mensaje de otro tópico que no nos sirve responderás con un mensaje breve aclarando cuál es el problema. Para tu mensaje debes usar el atributo message del objeto que devolverás.
              Tu respuesta solo debe ser un objeto JSON sin ningún caracter adicional. El Objeto tendrá la siguiente estructura, ejemplo:
              {\ntransaction: {\n  user_id: 550e8400-e29b-41d4-a716-446655441111,\n  category_id: 550e8400-e29b-41d4-a716-446655442222,\n  payment_method_id: 550e8400-e29b-41d4-a716-446655443333,\n  input_method_id: 2042fddf-8abf-4b4b-a4bb-eafc4978e921,\n  type: expense,\n  amount: 99.99,\n  currency: USD,\n  transaction_date: 2023-06-01T12:00:00Z,\n  description: Grocery shopping at Walmart,\n  is_recurring: false\n},\nmessage: La transacción está lista para ser guardada\n}\n\nuser_id, input_method_id y transaction_date ya están incluidos en el CONTEXT provisto y debes usarlos tal cual aparecen allí.\n\nPara category_id y payment_method_id, DEBES elegir un ID de los proporcionados en la lista de categorías y métodos de pago en el CONTEXT. Debes elegir el ID más apropiado basado en la descripción del usuario y NUNCA inventes IDs ficticios.\n\nEl type puede ser: expense o income según el contexto del mensaje y la categoría seleccionada.\nis_recurring será siempre false\n\nLas demás propiedades las deberás inferir del mensaje del usuario.\n\ncurrency debe ser una de estas opciones: USD, EUR, MXN (dólar, euro o peso mexicano). Si no se menciona específicamente, usa USD como valor predeterminado.\n              
              Recuerda que tu respuesta no debe ser otra cosa que el objeto de ejemplo que te pasé, empezando por { y terminando por }`,
            },
          ],
        },
        {
          role: "user",
          content: userContent as ResponseInputMessageContentList,
        },
      ],
      text: {
        format: {
          type: "text",
        },
      },
      reasoning: {},
      tools: [],
      temperature: 0.7,
      max_output_tokens: 2048,
      top_p: 1,
      store: true,
    })

    // Extract the response text from the OpenAI response
    const responseText = response.output_text

    try {
      // Parse the JSON string to an object
      const parsedResponse = JSON.parse(responseText)
      
      // Verificar que los campos obligatorios estén presentes
      if (parsedResponse.transaction) {
        const requiredFields = ['user_id', 'category_id', 'payment_method_id', 'input_method_id', 'transaction_date', 'type', 'amount'];
        const missingFields = requiredFields.filter(field => !parsedResponse.transaction[field]);
        
        if (missingFields.length > 0) {
          return NextResponse.json({
            message: `Falta información obligatoria. Por favor, proporciona ${missingFields.join(', ')} para registrar la transacción.`
          });
        }
        
        // Verificar que category_id existe en la lista de categorías
        if (parsedResponse.transaction.category_id) {
          const categoryExists = categories.some((cat: Category) => cat.id === parsedResponse.transaction.category_id);
          if (!categoryExists && categories.length > 0) {
            return NextResponse.json({
              message: `La categoría seleccionada no es válida. Por favor selecciona una categoría válida.`
            });
          }
        }
        
        // Verificar que payment_method_id existe en la lista de métodos de pago
        if (parsedResponse.transaction.payment_method_id) {
          const paymentMethodExists = paymentMethods.some((pm: PaymentMethod) => pm.id === parsedResponse.transaction.payment_method_id);
          if (!paymentMethodExists && paymentMethods.length > 0) {
            return NextResponse.json({
              message: `El método de pago seleccionado no es válido. Por favor selecciona un método de pago válido.`
            });
          }
        }
      }

      // Return the parsed JSON response
      return NextResponse.json(parsedResponse)
    } catch (error) {
      console.error("Error parsing JSON response:", error, responseText)
      return NextResponse.json(
        { message: "Error al interpretar la respuesta del modelo. Por favor, intenta nuevamente con un mensaje más claro." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { message: "Error al procesar la transacción" },
      { status: 500 },
    )
  }
}
