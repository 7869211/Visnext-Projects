import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

interface UseSpeechToTextProps {
  onTranscriptionCompleted?: (transcription: string) => Promise<void>;
}

interface UseSpeechToText {
  isTranscribing: boolean;
  transcription: string | null;
  error: string | null;
  transcribeAudio: (audioBlob: Blob) => Promise<void>;
}

const useSpeechToText = ({
  onTranscriptionCompleted,
}: UseSpeechToTextProps = {}): UseSpeechToText => {
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    setError(null);
    setTranscription(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async function () {
        const formData = new FormData();
        const timestamp = Date.now().toString();

        const base64Audio = (reader.result as string).split(",")[1]; // Remove the data URL prefix
        formData.append("audio", base64Audio);
        formData.append("timestamp", timestamp);

        const response = await fetch("/api/transcriptions", {
          headers: { Authorization: `Bearer ${await getToken()}` },
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
        setTranscription(data.result);
        if (onTranscriptionCompleted) {
          await onTranscriptionCompleted(data.result);
        }
      };
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsTranscribing(false);
    }
  };

  return {
    isTranscribing,
    transcription,
    error,
    transcribeAudio,
  };
};

export default useSpeechToText;
