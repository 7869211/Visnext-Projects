import { useEffect, useRef, useState } from "react";

interface UseAudioRecorder {
  isRecording: boolean;
  audioBlob: Blob | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecorder: () => void;
}

interface UseAudioRecorderProps {
  onRecordingStarted?: () => void;
  onRecordingStopped?: (audioBlob: Blob) => void;
  onRecordingError?: (error: string) => void;
}

const useAudioRecorder = ({
  onRecordingStarted,
  onRecordingStopped,
  onRecordingError,
}: UseAudioRecorderProps): UseAudioRecorder => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup function to stop any ongoing media stream
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
        if (onRecordingStopped) {
          onRecordingStopped(audioBlob);
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      if (onRecordingStarted) {
        onRecordingStarted();
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      if (onRecordingError) {
        onRecordingError(errorMessage);
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecorder = () => {
    setAudioBlob(null);
    setError(null);
  };

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecorder,
  };
};

export default useAudioRecorder;
