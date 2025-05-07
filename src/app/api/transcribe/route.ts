import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()

    // Get the audio file from the form data
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { message: "No audio file provided" },
        { status: 400 },
      )
    }

    // Convert the file to a buffer to use with OpenAI
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a file object that OpenAI can use
    const file = new File([buffer], audioFile.name, { type: audioFile.type })

    // Call OpenAI API for transcription
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1", // Using Whisper model for audio transcription
    })

    // Return the transcribed text
    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error("Error transcribing audio:", error)
    return NextResponse.json(
      { message: "Error al transcribir el audio" },
      { status: 500 },
    )
  }
}
