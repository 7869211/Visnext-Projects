import { useAuth } from "@clerk/clerk-react";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  AvatarConversationData,
  AvatarConversationMessageData,
  AvatarConversationOperationData,
  CreateAvatarConversationData,
  CreateAvatarConversationOperationData,
  UpdateAvatarConversationData,
} from "../conversations/models";
import {
  GetHeaders,
  MutateOptions,
  fetchData,
  getHeadersInitializer,
  postData,
  putData,
  removeData,
} from "../utils";

const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;

if (!FUNCTION_APP_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUNCTION_APP_URL in environment variables"
  );
}

// Conversations
async function fetchConversations(
  getHeaders: GetHeaders,
  avatarId?: string
): Promise<AvatarConversationData[]> {
  const endpoint = avatarId ?
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations` :
    `${FUNCTION_APP_URL}/api/conversations`;

  return fetchData<AvatarConversationData[]>(
    endpoint,
    getHeaders
  );
}

async function fetchConversation(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string
): Promise<AvatarConversationData> {
  return fetchData<AvatarConversationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}`,
    getHeaders
  );
}

async function createConversation(
  getHeaders: GetHeaders,
  avatarId: string,
  data: CreateAvatarConversationData
): Promise<AvatarConversationData> {
  return postData<CreateAvatarConversationData, AvatarConversationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations`,
    getHeaders,
    data
  );
}

async function updateConversation(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string,
  data: UpdateAvatarConversationData
): Promise<AvatarConversationData> {
  return putData<UpdateAvatarConversationData, AvatarConversationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}`,
    getHeaders,
    data
  );
}

async function fetchConversationMessages(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string
): Promise<AvatarConversationMessageData[]> {
  return fetchData<AvatarConversationMessageData[]>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}/messages`,
    getHeaders
  );
}

async function fetchConversationMessage(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string,
  messageId: string
): Promise<AvatarConversationMessageData> {
  return fetchData<AvatarConversationMessageData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}/messages/${messageId}`,
    getHeaders
  );
}

async function createConversationOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string,
  data: CreateAvatarConversationOperationData
): Promise<AvatarConversationOperationData> {
  return postData<
    CreateAvatarConversationOperationData,
    AvatarConversationOperationData
  >(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}/operations`,
    getHeaders,
    data
  );
}

async function fetchConversationOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string,
  operationId: string
): Promise<AvatarConversationOperationData> {
  return fetchData<AvatarConversationOperationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}/operations/${operationId}`,
    getHeaders
  );
}

// Custom hooks for Conversations
export function useFetchConversations(
  avatarId?: string
): UseQueryResult<AvatarConversationData[], Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["conversations", avatarId],
    queryFn: () =>
      fetchConversations(getHeadersInitializer(getToken), avatarId),
  });
}

export function useFetchConversationsOnDemand() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [data, setData] = useState<AvatarConversationData[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversationsOnDemand = useCallback(
    async (avatarId: string): Promise<AvatarConversationData[]> => {
      setIsLoading(true);
      setError(null);
      const getHeaders = getHeadersInitializer(getToken);
      try {
        const result = await fetchConversations(getHeaders, avatarId);
        setData(result);
        // Optionally update the query cache if needed
        queryClient.setQueryData(["conversations", avatarId], result);
        setIsLoading(false);
        return result;
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
        throw err;
      }
    },
    [getToken, queryClient]
  );

  return {
    fetchConversations: fetchConversationsOnDemand,
    data,
    isLoading,
    error,
  };
}

export function useFetchConversation(
  avatarId: string,
  conversationId: string
): UseQueryResult<AvatarConversationData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["conversation", avatarId, conversationId],
    queryFn: () =>
      fetchConversation(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId
      ),
  });
}

interface CreateAvatarConversationArgs {
  avatarId: string;
  data: CreateAvatarConversationData;
}
export function useCreateConversation(
  args?: MutateOptions<
    AvatarConversationData,
    Error,
    CreateAvatarConversationArgs
  >
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, data }) =>
      createConversation(getHeadersInitializer(getToken), avatarId, data),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.avatarId],
      });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}
interface UpdateConversationArgs {
  avatarId: string;
  conversationId: string;
  data: UpdateAvatarConversationData;
}
export function useUpdateConversation(
  args?: MutateOptions<AvatarConversationData, Error, UpdateConversationArgs>
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avatarId, conversationId, data }) =>
      updateConversation(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId,
        data
      ),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.avatarId],
      });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}

export function useFetchConversationMessages(
  avatarId: string,
  conversationId: string
): UseQueryResult<AvatarConversationMessageData[], Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["conversationMessages", avatarId, conversationId],
    queryFn: () =>
      fetchConversationMessages(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId
      ),
  });
}

export function useFetchConversationMessage(
  avatarId: string,
  conversationId: string,
  messageId: string
): UseQueryResult<AvatarConversationMessageData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["conversationMessage", avatarId, conversationId, messageId],
    queryFn: () =>
      fetchConversationMessage(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId,
        messageId
      ),
  });
}

interface CreateAvatarConversationOperationArgs {
  avatarId: string;
  conversationId: string;
  data: CreateAvatarConversationOperationData;
}
export function useCreateConversationOperation(
  args?: MutateOptions<
    AvatarConversationOperationData,
    Error,
    CreateAvatarConversationOperationArgs
  >
) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, conversationId, data }) =>
      createConversationOperation(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId,
        data
      ),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: args?.onSuccess,
  });
}

export function useFetchConversationOperation(
  avatarId: string,
  conversationId: string,
  operationId: string
) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["conversationOperation", avatarId, conversationId, operationId],
    queryFn: () =>
      fetchConversationOperation(
        getHeadersInitializer(getToken),
        avatarId,
        conversationId,
        operationId
      ),
  });
}

interface DeleteConversationArgs {
  avatarId: string;
  conversationId: string;
}

async function deleteConversation(
  getHeaders: GetHeaders,
  avatarId: string,
  conversationId: string
): Promise<void> {
  try {
    await removeData(
      `${FUNCTION_APP_URL}/api/avatars/${avatarId}/conversations/${conversationId}`,
      getHeaders
    );
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Error removing data:', error);
  }
}

export function useDeleteConversation(
  args?: MutateOptions<void, Error, DeleteConversationArgs>
) {
  const { getToken } = useAuth(); 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ avatarId, conversationId }) =>
      deleteConversation(getHeadersInitializer(getToken), avatarId, conversationId),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.avatarId],
      });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}