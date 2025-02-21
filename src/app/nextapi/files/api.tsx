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
  CreateFileOperationRequestData,
  FileData,
  FileOperationData,
  FileReferenceData,
  FileUsageData,
  UpdateFileOperationRequestData,
  UploadFileOperationData,
} from "./models";

const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;

if (!FUNCTION_APP_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_FUNCTION_APP_URL in environment variables"
  );
}

// File Management
async function fetchFiles(
  getHeaders: GetHeaders,
  avatarId: string
): Promise<FileData[]> {
  return fetchData<FileData[]>(`${FUNCTION_APP_URL}/api/avatars/${avatarId}/files`, getHeaders);
}

async function fetchFile(
  getHeaders: GetHeaders,
  avatarId: string,
  fileId: string
): Promise<FileData> {
  return fetchData<FileData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/files/${fileId}`,
    getHeaders
  );
}

async function createFileOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  data: CreateFileOperationRequestData
): Promise<FileOperationData> {
  return postData<CreateFileOperationRequestData, FileOperationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/files/operations`,
    getHeaders,
    data
  );
}

async function fetchFileOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  operationId: string
): Promise<FileOperationData> {
  return fetchData<FileOperationData>(
    `/api/avatars/${avatarId}/files/operations/${operationId}`,
    getHeaders
  );
}

async function updateFileOperation(
  getHeaders: GetHeaders,
  avatarId: string,
  operationId: string,
  data: UpdateFileOperationRequestData
): Promise<FileOperationData> {
  return putData<UpdateFileOperationRequestData, FileOperationData>(
    `${FUNCTION_APP_URL}/api/avatars/${avatarId}/files/operations/${operationId}`,
    getHeaders,
    data
  );
}

interface UploadProgress {
  current: number;
  total?: number;
  progress?: number;
}
async function uploadFile(
  uploadData: UploadFileOperationData,
  file: File,
  onUploadProgress: (status: UploadProgress) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", uploadData.uploadUrl, true);

    xhr.setRequestHeader("Content-Type", file.type);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");

    xhr.upload.onprogress = (event) => {
      const percentage = event.total
        ? Math.floor((event.loaded * 100) / event.total)
        : undefined;
      onUploadProgress({
        current: event.loaded,
        total: event.total,
        progress: percentage,
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error("File upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));

    xhr.send(file);
  });
}

// Custom hooks for File Management
export function useFetchFiles(
  avatarId?: string
): UseQueryResult<FileData[], Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["files", avatarId],
    queryFn: () => fetchFiles(getHeadersInitializer(getToken), avatarId!),
    enabled: !!avatarId,
  });
}

export function useFetchFile(
  avatarId?: string,
  fileId?: string
): UseQueryResult<FileData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["file", avatarId, fileId],
    queryFn: () =>
      fetchFile(getHeadersInitializer(getToken), avatarId!, fileId!),
    enabled: !!avatarId && !!fileId,
  });
}

interface CreateFileOperationArgs {
  avatarId: string;
  data: CreateFileOperationRequestData;
}
export function useCreateFileOperation(
  args?: MutateOptions<FileOperationData, Error, CreateFileOperationArgs>
) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, data }) =>
      createFileOperation(getHeadersInitializer(getToken), avatarId, data),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["files", variables.avatarId],
      });
      if (args?.onSuccess) {
        args.onSuccess(data, variables, context);
      }
    },
  });
}

export function useFetchFileOperation(
  avatarId?: string,
  operationId?: string
): UseQueryResult<FileOperationData, Error> {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["fileOperation", avatarId, operationId],
    queryFn: () =>
      fetchFileOperation(
        getHeadersInitializer(getToken),
        avatarId!,
        operationId!
      ),
    enabled: !!avatarId && !!operationId,
  });
}

interface UpdateFileOperationArgs {
  avatarId: string;
  operationId: string;
  data: UpdateFileOperationRequestData;
}
export function useUpdateFileOperation(
  args?: MutateOptions<FileOperationData, Error, UpdateFileOperationArgs>
) {
  const { getToken } = useAuth();
  return useMutation({
    mutationFn: ({ avatarId, operationId, data }) =>
      updateFileOperation(
        getHeadersInitializer(getToken),
        avatarId,
        operationId,
        data
      ),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: args?.onSuccess,
  });
}

interface FileArgs {
  id: string;
  file: File;
}
interface CreateUploadFileOperationArgs {
  avatarId: string;
  usage: FileUsageData;
  file: FileArgs;
  onUploadProgress?: (file: FileArgs, progress?: UploadProgress) => void;
  reference?: FileReferenceData;
}
export const useUploadFile = (
  args?: MutateOptions<FileOperationData, Error, CreateUploadFileOperationArgs>
) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: (a: CreateUploadFileOperationArgs) =>
      createFileOperation(getHeadersInitializer(getToken), a.avatarId, {
        operationType: "upload",
        upload: {
          contentType: a.file.file.type,
          name: a.file.file.name,
          usage: a.usage,
          reference: a.reference
            ? {
                conversationId: a.reference.conversationId,
              }
            : undefined,
        },
      }),
    onError: args?.onError,
    onMutate: args?.onMutate,
    onSettled: args?.onSettled,
    onSuccess: async (data, variables, context) => {
      if (!data.upload) {
        args?.onError?.(
          new Error("Upload operation did not return upload data"),
          variables,
          context
        );
        return;
      }

      await updateFileOperation(
        getHeadersInitializer(getToken),
        variables.avatarId,
        data.id,
        {
          upload: {
            status: "inProgress",
          },
        }
      );

      await uploadFile(data.upload!, variables.file.file, (progress) => {
        if (variables.onUploadProgress) {
          variables.onUploadProgress(variables.file, progress);
        }
      });

      var completedOperationData = await updateFileOperation(
        getHeadersInitializer(getToken),
        variables.avatarId,
        data.id,
        {
          upload: {
            status: "completed",
          },
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["files", variables.avatarId],
      });

      if (args?.onSuccess) {
        args.onSuccess(completedOperationData, variables, context);
      }
    },
  });
};
