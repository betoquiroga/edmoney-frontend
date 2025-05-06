/* eslint-disable camelcase */
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { ResponseInputMessageContentList } from "openai/resources/responses/responses.mjs"

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Extract the message, context and optional image from the request body
    const { message, context, image } = await request.json()

    // Generate prompt with context and message
    const prompt = `${context}\n\n${message}`

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
              {\ntransaction: {\n  user_id: 550e8400-e29b-41d4-a716-446655441111,\n  category_id: 550e8400-e29b-41d4-a716-446655442222,\n  payment_method_id: 550e8400-e29b-41d4-a716-446655443333,\n  input_method_id: 550e8400-e29b-41d4-a716-446655444444,\n  type: expense,\n  amount: 99.99,\n  currency: USD,\n  transaction_date: 2023-06-01T12:00:00Z,\n  description: Grocery shopping at Walmart,\n  is_recurring: false\n},\nmessage: Transacción creada con éxito\n}\n\nuser_id, category_id, payment_method_id, input_method_id y transaction_date serán provistos por el usuario en su mensaje de forma explícita como contexto para que los puedas seleccionar.\nEl type puede ser: expense o income\nis_recurring será siempre false\n\nLas demás propiedades las deberás inferir del mensaje del usuario.
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
      temperature: 1,
      max_output_tokens: 2048,
      top_p: 1,
      store: true,
    })

    // Extract the response text from the OpenAI response
    const responseText = response.output_text

    // Parse the JSON string to an object
    const parsedResponse = JSON.parse(responseText)

    // Return the parsed JSON response
    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { message: "Error al procesar la transacción" },
      { status: 500 },
    )
  }
}
