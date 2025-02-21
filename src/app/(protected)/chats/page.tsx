"use client";

import ChatComponent from "@/components/Memotars/ChatComponent";
import { ChatHeader } from "@/components/Chat/ChatHeader";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  useFetchConversations,
  useFetchConversationMessages,
  useCreateConversationOperation,
  useCreateConversation,
} from "@/app/nextapi/conversations/api";
import { ChatItem } from "@/components/Chat/ChatItem";
import {
  AvatarConversationData,
  AvatarConversationMessageData,
  ConversationFileReferenceData,
} from "@/app/nextapi/conversations/models";
import { v4 as uuid } from "uuid";
import { MobileChatList } from "@/components/Chat/MobileChatList";
import { MobileChatView } from "@/components/Chat/MobileChatView";
import { ChatSearchHeader } from "@/components/Chat/ChatSearchHeader";
import { useFetchAvatars } from "@/app/nextapi/avatars/api";
import { AvatarData } from "@/app/nextapi/avatars/models";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";

export default function ChatsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] =
    useState<AvatarConversationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const { user } = useUser();
  // Fetch conversations
  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    error: fetchConversationsError,
    refetch: refetchConversations,
  } = useFetchConversations();

  const { mutateAsync: createConversation } = useCreateConversation();

  // Handle selecting conversation from query params
  useEffect(() => {
    const selectedConversationId = searchParams.get("selectedConversation");
    if (selectedConversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.id === selectedConversationId
      );
      if (conversation) {
        setSelectedConversation(conversation);
        if (isMobileView) {
          setShowMobileChat(true);
        }
        // Clear the query parameter by replacing the URL
        router.replace("/chats");
      }
    }
  }, [searchParams, conversations, isMobileView, router]);

  // Fetch messages for selected conversation
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: fetchMessages,
    error: fetchMessagesError,
  } = useFetchConversationMessages(
    selectedConversation?.avatarId || "",
    selectedConversation?.id || ""
  );

  // Handle errors from fetching conversations or messages
  useEffect(() => {
    if (fetchConversationsError) {
      setError("Failed to load conversations.");
    } else if (fetchMessagesError) {
      setError("Failed to load messages.");
    } else {
      setError(null);
    }
  }, [fetchConversationsError, fetchMessagesError]);

  const { mutateAsync: createOperation } = useCreateConversationOperation();

  const handleSendMessage = async (message: string, fileIds: string[]) => {
    if (!selectedConversation) return;

    const userMessage: AvatarConversationMessageData = {
      id: uuid(),
      messageType: { label: "user" },
      items: [{ $type: "text", content: message }],
    };

    const updatedMessages = [...messages, userMessage];
    queryClient.setQueryData(
      [
        "conversationMessages",
        selectedConversation.avatarId,
        selectedConversation.id,
      ],
      updatedMessages
    );

    try {
      const fileReferences: ConversationFileReferenceData[] = fileIds.map(
        (id) => ({
          fileId: id,
        })
      );
      const response = await createOperation({
        avatarId: selectedConversation.avatarId,
        conversationId: selectedConversation.id,
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
      const withoutTemp = messages.filter(
        (msg: AvatarConversationMessageData) => msg.id !== userMessage.id
      );
      const finalMessages = [...withoutTemp, ...apiMessages];
      queryClient.setQueryData(
        [
          "conversationMessages",
          selectedConversation.avatarId,
          selectedConversation.id,
        ],
        finalMessages
      );

      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      const withoutTemp = messages.filter(
        (msg: AvatarConversationMessageData) => msg.id !== userMessage.id
      );
      queryClient.setQueryData(
        [
          "conversationMessages",
          selectedConversation.avatarId,
          selectedConversation.id,
        ],
        withoutTemp
      );
    }
  };

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Add filtered conversations
  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const { data: avatars = [] } = useFetchAvatars();

  const handleAvatarSelect = async (avatar: AvatarData) => {
    try {
      setIsCreatingConversation(true);
      const newConversation = await createConversation({
        avatarId: avatar.id,
        data: {
          type: "interaction",
          title: `Chat with ${avatar.characterCard.data.name}`,
          description: "",
        },
      });
      await refetchConversations();
      // Select the newly created conversation
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  };

  // Add useEffect for handling window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMobileConversationSelect = (
    conversation: AvatarConversationData
  ) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  if (!user) return null;

  // Mobile view
  if (isMobileView) {
    return (
      <>
        {isCreatingConversation && <LoaderOverlay />}

        {showMobileChat && selectedConversation ? (
          <MobileChatView
            conversation={selectedConversation}
            messages={messages}
            isLoading={isLoadingMessages}
            onBack={() => setShowMobileChat(false)}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <MobileChatList
            conversations={filteredConversations}
            isLoading={isLoadingConversations}
            onSelectConversation={handleMobileConversationSelect}
            onSearch={handleSearch}
            avatars={avatars}
            onSelectAvatar={handleAvatarSelect}
            isCreatingConversation={isCreatingConversation}
          />
        )}
      </>
    );
  }

  // Desktop view (existing return statement)
  return (
    <>
      {isCreatingConversation && <LoaderOverlay />}
      <div className="flex h-screen bg-[rgb(var(--background-secondary-rgb-light))] border border-b-grey-2 dark:bg-b-purple-4 dark:border-[var(--dark-border-color)]">
        {/* Left sidebar */}
        <div className="w-[300px] border-r border-b-grey-2 dark:border-r-[var(--dark-border-color)]">
          <ChatSearchHeader
            className="flex"
            onSearch={handleSearch}
            avatars={avatars}
            onSelectAvatar={handleAvatarSelect}
            isCreating={isCreatingConversation}
          />

          <div className="overflow-y-auto h-[calc(100vh-80px)] ">
            {isLoadingConversations ? (
              <div className="flex justify-center items-center h-22">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-b-purple-1"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex justify-center items-center h-22 text-b-grey-4 dark:text-white">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`mx-4 mb-2 hover:bg-b-grey-1 rounded-lg cursor-pointer ${
                    selectedConversation?.id === conversation.id
                      ? "border border-b-purple-1 rounded-lg"
                      : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <ChatItem {...conversation} className="hover:dark:border-b-grey-6" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-black ">
          {selectedConversation ? (
            <>
              <ChatHeader
                name={selectedConversation.title}
                avatarId={selectedConversation.avatarId}
                conversationId={selectedConversation.id}
              />{" "}
              <div className="flex-1 min-h-0">
                <ChatComponent
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoadingMessages}
                  avatarId={selectedConversation.avatarId}
                  conversationId={selectedConversation.id}
                  className="dark:bg-b-grey-6 dark:opacity-100 dark:text-black"
                  />
              </div>
            </>
          ) : avatars.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-b-grey-4">
                Please{" "}
                <Link
                  href="/memotars/create"
                  className="text-b-purple-1 underline dark:text-white"
                >
                  create a New Memotar
                </Link>{" "}
                to start chatting
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-b-grey-4 dark:text-white">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
