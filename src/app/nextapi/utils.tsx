interface Register {}
type DefaultError = Register extends {
  defaultError: infer TError;
}
  ? TError
  : Error;

export interface MutateOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown
> {
  onMutate?: (
    variables: TVariables
  ) => Promise<TContext | undefined> | TContext | undefined;
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext
  ) => Promise<unknown> | unknown;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<unknown> | unknown;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => Promise<unknown> | unknown;
}

export type GetToken = () => Promise<string | null>;

export interface AuthHeader {
  Authorization: string;
}

export interface EmptyHeader {}

export function getHeadersInitializer(
  getToken: GetToken
): () => Promise<AuthHeader | EmptyHeader> {
  return async () => {
    const token = await getToken();
    if (token != null) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };
}

export type GetHeaders = () => Promise<AuthHeader | EmptyHeader>;

export async function fetchData<T>(
  url: string,
  getHeaders: GetHeaders
): Promise<T> {
  const headers = await getHeaders();
  const response = await fetch(url, { headers: { ...headers } });
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  return response.json();
}

export async function postData<T, R>(
  url: string,
  getHeaders: GetHeaders,
  data: T
): Promise<R> {
  const headers = await getHeaders();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error posting data: ${response.statusText}`);
  }
  return response.json();
}

export async function putData<T, R>(
  url: string,
  getHeaders: GetHeaders,
  data: T
): Promise<R> {
  const headers = await getHeaders();
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error updating data: ${response.statusText}`);
  }
  return response.json();
}

export async function removeData(
  url: string,
  getHeaders: GetHeaders
): Promise<Response> {
  const headers = await getHeaders();
  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...headers },
  });
  return response;
}
