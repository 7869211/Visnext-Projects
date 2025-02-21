import { NextRequest, NextResponse } from 'next/server';
import OpenAI, { toFile } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();

    const timestamp = formData.get("timestamp") as string;
    const audioEntry = formData.get("audio");

    if (audioEntry == null) {
      throw new Error("Audio data is missing");
    }

    // Convert back to binary data from base64 string
    const audioBuffer = Buffer.from(audioEntry as string, "base64");
    console.log(`Audio buffer created with length: ${audioBuffer.length}`);

    // Convert to File type, expected by openai
    const audioFile = await toFile(audioBuffer, "audiobuffer.webm", {
      type: "audio/webm",
    });
    console.log("Detected audio type: ", audioFile.type);

    // Send request
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    console.log("transcription: ", transcription.text);

    return NextResponse.json({ result: transcription.text, timestamp });
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error instanceof Error) {
      console.error(
        `Error with OpenAI API request: ${(error as Error).message}`
      );
      return NextResponse.json(
        {
          error: {
            message: `An error occurred during your request: ${
              (error as Error).message
            }`,
          },
        },
        { status: 500 }
      );
    }
  }
}
