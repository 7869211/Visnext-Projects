import { Datum } from "../models";
import { MediaTypeData } from "../files/models";

export type AvatarConversationType = "interaction" | "contribution";

export interface AvatarConversationData extends Datum {
  avatarId: string;
  title: string;
  description: string;
  type: AvatarConversationType;
  syncedContributionMessagesAt: Date;
}

export interface CreateAvatarConversationData {
  title?: string;
  description?: string;
  type: AvatarConversationType;
}

export interface UpdateAvatarConversationData {
  title: string;
  description: string;
}

export type AuthorRoleType = "system" | "user" | "assistant";

export interface AuthorRoleData {
  label: AuthorRoleType;
}

export type AvatarConversationMessageContentType = "file" | "text";

export interface AvatarConversationMessageFileContentData {
  $type: "file";
  file: ConversationFileReferenceData;
  contentType: string;
  mediaType: MediaTypeData;
  path: string;
}

export interface AvatarConversationMessageTextContentData {
  $type: "text";
  content: string;
}

export type AvatarConversationMessageContentDataBase =
  | AvatarConversationMessageFileContentData
  | AvatarConversationMessageTextContentData;

export interface AvatarConversationMessageData extends Datum {
  items: AvatarConversationMessageContentDataBase[];
  messageType: AuthorRoleData;
}

export type AvatarConversationOperationType = "prompt";

export interface CreateAvatarConversationOperationData {
  operationType: AvatarConversationOperationType;
  prompt?: CreateAvatarConversationPromptOperationData;
}

export interface CreateAvatarConversationPromptOperationData {
  content: string;
  files?: ConversationFileReferenceData[];
}

export interface AvatarConversationPromptOperationData {
  content: string;
  files?: ConversationFileReferenceData[];
  messages?: AvatarConversationMessageData[];
}

export interface ConversationFileReferenceData {
  fileId: string;
}

export interface AvatarConversationOperationData extends Datum {
  operationType: AvatarConversationOperationType;
  prompt?: AvatarConversationPromptOperationData;
}
