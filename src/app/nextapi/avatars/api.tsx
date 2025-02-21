import { useAuth } from "@clerk/clerk-react";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  GetHeaders,
  MutateOptions,
  fetchData,
  getHeadersInitializer,
  postData,
  putData,
} from "../utils";
import {
  AvatarData,
  AvatarOperationData,
  CreateAvatarData,
  CreateAvatarOperationRequestData,
  UpdateAvatarData,
} from "./models";

const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;

if (!FUNCTION_APP_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUNCTION_APP_URL in environment variables"
  );
}

// Avatar Management
async function fetchAvatars(getHeaders: GetHeaders): Promise<AvatarData[]> {
  return fetchData<AvatarData[]>(`${FUNCTION_APP_URL}/api/avatars`, getHeaders);
}

async function fetchAvatar(
  getHeaders: GetHeaders,
  id: string
): Promise<AvatarData> {
  return fetchData<AvatarData>(`${FUNCTION_APP_URL}/api/avatars/${id}`, getHeaders);
}

async function createAvatar(
  getHeaders: GetHeaders,
  data: CreateAvatarData
): Promise<AvatarData> {
  return postData<CreateAvatarData, AvatarData>(
    `${FUNCTION_APP_URL}/api/avatars`,
    getHeaders,
    data
  );
}

async function updateAvatar(
  getHeaders: GetHeaders,
  id: string,
  data: UpdateAvatarData
): Promise<AvatarData> {
  return putData<UpdateAvatarData, AvatarData>(
    `${FUNCTION_APP_URL}/api/avatars/${id}`,
    getHeaders,
    data
  );
}

async function createAvatarOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  data: CreateAvatarOperationRequestData
): Promise<AvatarOperationData> {
  return postData<CreateAvatarOperationRequestData, AvatarOperationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/operations`,
    getHeaders,
    data
  );
}

// Custom hooks for Avatar Management
export function useFetchAvatars(): UseQueryResult<AvatarData[], Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["avatars"],
    queryFn: () => fetchAvatars(getHeadersInitializer(getToken)),
  });
}

export function useFetchAvatar(id?: string): UseQueryResult<AvatarData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["avatar", id],
    queryFn: () => fetchAvatar(getHeadersInitializer(getToken), id!),
    enabled: !!id,
  });
}

interface CreateAvatarArgs {
  data: CreateAvatarData;
}
export function useCreateAvatar(
  args?: MutateOptions<AvatarData, Error, CreateAvatarArgs>
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ data }) =>
      createAvatar(getHeadersInitializer(getToken), data),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}

interface UpdateAvatarArgs {
  id: string;
  data: UpdateAvatarData;
}
export function useUpdateAvatar(
  args?: MutateOptions<AvatarData, Error, UpdateAvatarArgs>
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      updateAvatar(getHeadersInitializer(getToken), id, data),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["avatars"] });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}

interface CreateAvatarOperationArgs {
  avatarId: string;
  data: CreateAvatarOperationRequestData;
}
export function useCreateAvatarOperation(
  args?: MutateOptions<AvatarOperationData, Error, CreateAvatarOperationArgs>
) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avatarId, data }) =>
      createAvatarOperation(getHeadersInitializer(getToken), avatarId, data),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["avatar", variables.avatarId],
      });
      queryClient.invalidateQueries({ queryKey: ["avatar"] });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}
