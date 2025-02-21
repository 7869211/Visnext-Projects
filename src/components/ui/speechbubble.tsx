import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";

interface SpeechBubbleProps {
  message: string;
  isUserMessage: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  message,
  isUserMessage,
  avatarSrc = "/placeholder-user.jpg",
  avatarFallback,
}) => (
  <div
    className={`flex items-start gap-3 ${isUserMessage ? "justify-end" : ""}`}
  >
    {!isUserMessage && (
      <Avatar className="border w-8 h-8">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{avatarFallback ?? "JD"}</AvatarFallback>
      </Avatar>
    )}
    <div
      className={`rounded-2xl p-3 max-w-[70%] ${
        isUserMessage
          ? "bg-[#f5f5f5] dark:bg-gray-800 dark:text-gray-200"
          : "bg-[#f0f8ff] text-black"
      }`}
    >
      <p className="text-sm">{message}</p>
    </div>
    {isUserMessage && (
      <Avatar className="border w-8 h-8">
        <AvatarImage src={avatarSrc} />
        <AvatarFallback>{avatarFallback ?? "SM"}</AvatarFallback>
      </Avatar>
    )}
  </div>
);

export { SpeechBubble };
