import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { ElevenLabsClient } from "elevenlabs";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error("Missing ELEVENLABS_API_KEY in environment variables");
}

const elevenLabsClient = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

interface UseTextToSpeech {
  isLoading: boolean;
  error: string | null;
  generateSpeech: (text: string, voice: string) => Promise<Buffer>;
}

const useTextToSpeech = (): UseTextToSpeech => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const generateSpeech = async (text: string, voice: string): Promise<Buffer> => {
    setIsLoading(true);
    setError(null);

    try {
      console.debug("Sending message to TTS: ", text);

      const audioStream = await elevenLabsClient.generate({
        voice: voice,
        model_id: "eleven_turbo_v2",
        text,
      });

      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
      }

      const content = Buffer.concat(chunks);
      return content;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateSpeech,
  };
};

export default useTextToSpeech;
