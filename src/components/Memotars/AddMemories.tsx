"use client";

import { MessagesSquare } from "lucide-react";
import ChatComponent from "./ChatComponent";
import {
  useCreateConversation,
  useFetchConversationMessages,
  useCreateConversationOperation,
  useFetchConversationsOnDemand,
} from "@/app/nextapi/conversations/api";
import { useState, useEffect, useRef } from "react";
import { AvatarConversationMessageData } from "@/app/nextapi/conversations/models";
import { v4 as uuid } from "uuid";
import { ConversationFileReferenceData } from "@/app/nextapi/conversations/models";

interface AddMemoriesProps {
  avatarId: string;
}

export default function AddMemories({ avatarId }: AddMemoriesProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AvatarConversationMessageData[]>([]);
  const { mutateAsync: createConversation } = useCreateConversation();
  const { mutateAsync: createOperation } = useCreateConversationOperation();
  const hasInitialized = useRef(false);
  const { fetchConversations } = useFetchConversationsOnDemand();

  const {
    data: conversationMessages,
    refetch: fetchMessages,
    isLoading: isLoadingMessages,
  } = useFetchConversationMessages(avatarId, conversationId || "");

  useEffect(() => {
    if (conversationMessages) {
      setMessages(conversationMessages);
    }
  }, [conversationMessages]);

  // Create conversation only once on mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // First check for existing contribution conversation
        const conversations = await fetchConversations(avatarId);
        const existingContributionChat = conversations.find(
          (conv) => conv.type === "contribution"
        );

        if (existingContributionChat) {
          setConversationId(existingContributionChat.id);
        } else {
          // Create new conversation if none exists
          const conversation = await createConversation({
            avatarId,
            data: {
              type: "contribution",
              description: "Interview style chat with the Biographer",
              title: "Your Memotar Chat",
            },
          });
          setConversationId(conversation.id);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    if (!conversationId && !hasInitialized.current) {
      hasInitialized.current = true;
      initializeChat();
    }
  }, [avatarId, createConversation, conversationId, fetchConversations]);

  const handleSendMessage = async (message: string, fileIds: string[]) => {
    if (!conversationId) return;

    const userMessage: AvatarConversationMessageData = {
      id: uuid(),
      messageType: { label: "user" },
      items: [{ $type: "text", content: message }],
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const fileReferences: ConversationFileReferenceData[] = fileIds.map(
        (id) => ({
          fileId: id,
        })
      );

      const response = await createOperation({
        avatarId,
        conversationId,
        data: {
          operationType: "prompt",
          prompt: {
            content: message,
            files: fileReferences,
          },
        },
      });

      // Update messages
      const apiMessages = response.prompt?.messages ?? [];
      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);
        return [...withoutTemp, ...apiMessages];
      });

      await fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    }
  };

  return (
    <div className="flex flex-col h-full mt-8">
      <div className="flex-shrink-0 font-montserrat mb-6">
        <h2 className="text-2xl font-semibold mb-4 tracking-spaced text-b-black-1 dark:text-white">
          Add memories (optional)
        </h2>

        <p className="text-base tracking-spaced mb-8 text-b-black-1 dark:text-white">
          Memories are the main source of data for your memotar! By adding
          memories they&apos;ll be preserved and your memotar will sound more
          like the original person when chatting. You&apos;ll always be able to
          add these later!
        </p>

        <div>
          <h3 className="text-b-black-1 mb-4 tracking-spaced text-base dark:text-white">
            How would you like to add memories?
          </h3>

          <div className="w-full border border-b-purple-1 rounded-lg p-3 max-w-sm bg-b-purple-5
           dark:border-none dark:bg-b-purple-5">
            <div className="flex items-start gap-2.5 ">
              <MessagesSquare className="text-b-purple-3 " size={52} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm tracking-spaced text-b-black-1 dark:text-white">
                    Interview style
                  </h4>
                  <span className="text-xs bg-b-purple-1 text-white px-2 py-1 rounded dark:text-white dark:bg-b-black-2">
                    Selected
                  </span>
                </div>
                <p className="text-sm tracking-spaced text-b-black-1 mt-2 dark:text-white">
                  You&apos;ll chat with the Biographer who will ask you some
                  questions to gather information about important life events.
                  You can stop at any time!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatComponent
          messages={messages}
          onSendMessage={async (message, fileIds) => {
            await handleSendMessage(message, fileIds);
          }}
          isLoading={!conversationId || isLoadingMessages}
          avatarId={avatarId}
          conversationId={conversationId || ""}
          className="dark:bg-b-purple-1 dark:opacity-100 dark:text-white"
        />
      </div>
    </div>
  );
}
