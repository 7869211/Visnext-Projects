import {
  GetHeaders,
  MutateOptions,
  fetchData,
  getHeadersInitializer,
  postData,
  putData,
} from "../utils";

import { useAuth } from "@clerk/clerk-react";
import {
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AvatarInvitationData,
  AvatarInvitationOperationData,
  CreateAvatarInvitationData,
  CreateAvatarInvitationOperationData,
  UpdateAvatarInvitationData,
} from "./models";

const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;

if (!FUNCTION_APP_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUNCTION_APP_URL in environment variables"
  );
}

// Avatar Collaboration
async function createAvatarInvitation(
  getHeaders: GetHeaders,
  avatarId: string,
  data: CreateAvatarInvitationData
): Promise<AvatarInvitationData> {
  return postData<CreateAvatarInvitationData, AvatarInvitationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/invitations`,
    getHeaders,
    data
  );
}

async function fetchAvatarInvitation(
  getHeaders: GetHeaders,
  avatarId: string,
  invitationId: string
): Promise<AvatarInvitationData> {
  return fetchData<AvatarInvitationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/invitations/${invitationId}`,
    getHeaders
  );
}

async function createAvatarInvitationOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  invitationId: string,
  data: CreateAvatarInvitationOperationData
): Promise<AvatarInvitationOperationData> {
  return postData<
    CreateAvatarInvitationOperationData,
    AvatarInvitationOperationData
  >(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/invitations/${invitationId}/operations`,
    getHeaders,
    data
  );
}

async function fetchAvatarInvitationOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  invitationId: string,
  operationId: string
): Promise<AvatarInvitationOperationData> {
  return fetchData<AvatarInvitationOperationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/invitations/${invitationId}/operations/${operationId}`,
    getHeaders
  );
}

async function updateAvatarInvitation(
  getHeaders: GetHeaders,
  avatarId: string,
  invitationId: string,
  data: UpdateAvatarInvitationData
): Promise<AvatarInvitationData> {
  return putData<UpdateAvatarInvitationData, AvatarInvitationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/invitations/${invitationId}`,
    getHeaders,
    data
  );
}

interface CreateAvatarInvitationArgs {
  avatarId: string;
  data: CreateAvatarInvitationData;
}
export function useCreateAvatarInvitation(
  args?: MutateOptions<AvatarInvitationData, Error, CreateAvatarInvitationArgs>
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, data }) =>
      createAvatarInvitation(getHeadersInitializer(getToken), avatarId, data),
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

export function useFetchAvatarInvitation(
  avatarId?: string,
  invitationId?: string
): UseQueryResult<AvatarInvitationData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["avatarInvitation", avatarId, invitationId],
    queryFn: () =>
      fetchAvatarInvitation(
        getHeadersInitializer(getToken),
        avatarId!,
        invitationId!
      ),
    enabled: !!avatarId && !!invitationId,
  });
}
interface CreateAvatarInvitationOperationArgs {
  avatarId: string;
  invitationId: string;
  data: CreateAvatarInvitationOperationData;
}
export function useCreateAvatarInvitationOperation(
  args?: MutateOptions<
    AvatarInvitationOperationData,
    Error,
    CreateAvatarInvitationOperationArgs
  >
) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, invitationId, data }) =>
      createAvatarInvitationOperation(
        getHeadersInitializer(getToken),
        avatarId,
        invitationId,
        data
      ),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: args?.onSuccess,
  });
}

export function useFetchAvatarInvitationOperation(
  avatarId?: string,
  invitationId?: string,
  operationId?: string
): UseQueryResult<AvatarInvitationOperationData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: [
      "avatarInvitationOperation",
      avatarId,
      invitationId,
      operationId,
    ],
    queryFn: () =>
      fetchAvatarInvitationOperation(
        getHeadersInitializer(getToken),
        avatarId!,
        invitationId!,
        operationId!
      ),
    enabled: !!avatarId && !!invitationId && !!operationId,
  });
}

interface UpdateAvatarInvitationArgs {
  avatarId: string;
  invitationId: string;
  data: UpdateAvatarInvitationData;
}

export function useUpdateAvatarInvitation(
  args?: MutateOptions<AvatarInvitationData, Error, UpdateAvatarInvitationArgs>
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, invitationId, data }) =>
      updateAvatarInvitation(
        getHeadersInitializer(getToken),
        avatarId,
        invitationId,
        data
      ),
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
