import Image from "next/image";
import { ChatItem } from "./ChatItem";
import { ChatSearchHeader } from "./ChatSearchHeader";
import { AvatarConversationData } from "@/app/nextapi/conversations/models";
import { AvatarData } from "@/app/nextapi/avatars/models";
import { useState } from "react";

interface MobileChatListProps {
  conversations: AvatarConversationData[];
  isLoading: boolean;
  onSelectConversation: (conversation: AvatarConversationData) => void;
  onSearch?: (query: string) => void;
  onCreateNew?: () => void;
  avatars: AvatarData[];
  onSelectAvatar?: (avatar: AvatarData) => void;
  isCreatingConversation: boolean;
}

export function MobileChatList({
  conversations,
  isLoading,
  onSelectConversation,
  avatars,
  onSearch,
  onSelectAvatar,
  isCreatingConversation,
}: MobileChatListProps) {
  return (
    <div className="flex flex-col h-full bg-white md:hidden dark:bg-b-black-1">
      <ChatSearchHeader
        onSearch={onSearch}
        avatars={avatars}
        onSelectAvatar={onSelectAvatar}
        isCreating={isCreatingConversation}
        className="dark:!bg-b-black-1"
      />

      <div className="flex-1 overflow-y-auto pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-22">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-b-purple-1"></div>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="mx-4 mb-2 hover:bg-b-grey-1 cursor-pointer rounded-lg"
              onClick={() => onSelectConversation(conversation)}
            >
              <ChatItem {...conversation} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
