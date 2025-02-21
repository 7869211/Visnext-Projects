import { ArrowLeft } from "lucide-react";
import { ChatHeader } from "./ChatHeader";
import ChatComponent from "../Memotars/ChatComponent";
import {
  AvatarConversationData,
  AvatarConversationMessageData,
} from "@/app/nextapi/conversations/models";

interface MobileChatViewProps {
  conversation: AvatarConversationData;
  messages: AvatarConversationMessageData[];
  isLoading: boolean;
  onBack: () => void;
  onSendMessage: (message: string, fileIds: string[]) => Promise<void>;
}

export function MobileChatView({
  conversation,
  messages,
  isLoading,
  onBack,
  onSendMessage,
}: MobileChatViewProps) {
  return (
    <div className="flex flex-col h-full bg-white md:hidden">
      <div
        className="flex-shrink-0 flex flex-col items-center px-4 py-3 bg-white border-b border-b-grey-2 
      dark:bg-b-black-1 dark:border-[#292929]"
      >
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-b-grey-1 rounded-full dark:hover:bg-b-purple-6"
          >
            <ArrowLeft className="h-5 w-5 text-b-black-1 dark:text-white" />
          </button>
        </div>
        <ChatHeader name={conversation.title} />
      </div>

      <div className="flex-1 min-h-0">
        <ChatComponent
          messages={messages}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          avatarId={conversation.avatarId}
          conversationId={conversation.id}
          className="dark:bg-b-grey-6 dark:text-black"
        />
      </div>
    </div>
  );
}
