"use client";

import { ChatItem } from "./ChatItem";
import { useFetchConversations } from "@/app/nextapi/conversations/api";
import type { User } from "@/types/user.types";
import { useRouter } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { Chat } from "@/types/chat.types";
import { ViewAllCard } from "./ViewAllCard";

interface ChatListCompactProps {
  user: User;
}

export const ChatListCompact: React.FC<ChatListCompactProps> = ({ user }) => {
  const {
    data: conversations = [],
    isLoading,
    error,
  } = useFetchConversations();
  
  const router = useRouter();

  const handleCardClick = (chat: Chat) => {
    sendGAEvent("event", "avatar_conversation_mode_selected", {
      user_id: user?.id,
      avatar_id: chat.avatarId,
      conversation_type: "interaction",
    });

    router.push(
      `/interact?avatarId=${chat.avatarId}&convId=${chat.id}&isContrib=false`
    );
  };

  if (error) {
    return <div className="text-poppy">Error loading chats</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-22">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-b-purple-1"></div>
      </div>
    );
  }

  return (
    <>
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center font-montserrat">
          <p className="mb-4 text-sm tracking-wide text-b-grey-5 dark:text-white">
            No chats to display
          </p>
        </div>
      ) : (
        <div className="flex flex-col font-montserrat gap-2 sm:grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {conversations
            .slice(0, window.innerWidth < 768 ? 3 : 8)
            .map((chat) => (
              <div key={chat.id} onClick={() => handleCardClick(chat)}>
                <ChatItem {...chat} />
              </div>
            ))}
          <ViewAllCard itemCount={conversations.length} />
        </div>
      )}
    </>
  );
};
