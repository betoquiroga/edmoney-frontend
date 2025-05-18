import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createReadStream } from "fs"
import { writeFile } from "fs/promises"
import { tmpdir } from "os"
import path from "path"

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Get the JSON from the request
    const { userId, audioBase64 } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: "No se proporcionó ID de usuario" },
        { status: 400 },
      )
    }

    if (!audioBase64) {
      return NextResponse.json(
        { message: "No se proporcionó audio" },
        { status: 400 },
      )
    }
    
    try {
      // Convertir base64 a un buffer
      const buffer = Buffer.from(audioBase64, 'base64');
      
      // Guardar temporalmente el archivo en el sistema
      const tempFilePath = path.join(tmpdir(), `audio-${userId}-${Date.now()}.webm`);
      await writeFile(tempFilePath, buffer);
      
      console.log(`Archivo temporal guardado en: ${tempFilePath}`);
      
      // Crear un stream para el archivo
      const audioFileStream = createReadStream(tempFilePath);
      
      console.log(`Procesando transcripción para usuario ${userId}, tamaño del archivo: ${buffer.length} bytes`);

      // Llamar a la API de OpenAI para la transcripción
      const transcription = await openai.audio.transcriptions.create({
        file: audioFileStream,
        model: "whisper-1", // Usando el modelo Whisper para transcripción de audio
      });

      console.log(`Transcripción completa: "${transcription.text}"`);

      // Devolver el texto transcrito
      return NextResponse.json({ text: transcription.text });
    } catch (error) {
      console.error("Error en el procesamiento del audio:", error);
      return NextResponse.json(
        { message: `Error procesando el audio: ${error instanceof Error ? error.message : 'Error desconocido'}` },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error en la API de transcripción:", error);
    return NextResponse.json(
      { message: `Error al transcribir el audio: ${error instanceof Error ? error.message : 'Error desconocido'}` },
      { status: 500 },
    );
  }
}
