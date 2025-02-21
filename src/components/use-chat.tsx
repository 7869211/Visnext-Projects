import { useFetchAvatar } from "@/app/nextapi/avatars/api";
import {
  useCreateConversationOperation,
  useFetchConversation,
  useFetchConversationMessages,
} from "@/app/nextapi/conversations/api";
import {
  AvatarConversationMessageData,
  ConversationFileReferenceData,
} from "@/app/nextapi/conversations/models";
import { useCallback } from "react";
import { v4 as uuid } from "uuid";

interface UseChatArgs {
  onPromptResponseReceived?: (
    responses: AvatarConversationMessageData[]
  ) => Promise<void>;
}

export function useChat(
  avatarId: string,
  conversationId: string,
  { onPromptResponseReceived }: UseChatArgs = {}
) {
  const {
    data: avatar,
    isLoading: isAvatarLoading,
    error: fetchAvatarError,
  } = useFetchAvatar(avatarId);
  const {
    data: conversation,
    isLoading: isConversationLoading,
    error: fetchConversationError,
  } = useFetchConversation(avatarId, conversationId);
  const {
    data: conversationMessages,
    isLoading: areMessagesLoading,
    refetch: reloadConversationMessages,
  } = useFetchConversationMessages(avatarId, conversationId);
  const {
    mutateAsync: createPromptMessageOperation,
    error: submitPromptMessageError,
  } = useCreateConversationOperation();

  const submitPrompt = useCallback(
    async (prompt: string, files: ConversationFileReferenceData[] = []) => {
      conversationMessages?.push({
        id: uuid(),
        messageType: { label: "user" },
        items: [
          {
            $type: "text",
            content: prompt,
          },
        ],
      });
      const promptResponse = await createPromptMessageOperation({
        avatarId,
        conversationId,
        data: {
          operationType: "prompt",
          prompt: {
            content: prompt,
            files,
          },
        },
      });
      const messages = promptResponse.prompt?.messages ?? [];
      conversationMessages?.pop();
      conversationMessages?.push(...messages);
      if (onPromptResponseReceived) {
        await onPromptResponseReceived(messages);
      }
    },
    [
      conversationMessages,
      createPromptMessageOperation,
      avatarId,
      conversationId,
      onPromptResponseReceived,
    ]
  );

  return {
    submitPrompt,
    avatar,
    conversation,
    error:
      fetchAvatarError || fetchConversationError || submitPromptMessageError,
    messages: conversationMessages,
    reload: () => reloadConversationMessages(),
    isAvatarLoading,
    isConversationLoading,
    areMessagesLoading,
    isLoading: isAvatarLoading || isConversationLoading || areMessagesLoading,
  };
}
