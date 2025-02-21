export interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

export type User = UserData | null | undefined;
