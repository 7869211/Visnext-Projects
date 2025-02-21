import { Datum } from "../models";
import { UserInfoData } from "../users/models";
import { CharCard } from "../../../types/charcard.types";

export interface AvatarData extends Datum {
  characterCard: CharCard;
  voice: string;
  sharedWith: AvatarUserPermissionData[];
  accessControl: AvatarAccessControlData;
  thumbnail: string | null;
  updatedAt: Date;
}

export interface AvatarAccessControlData {
  canContribute: boolean;
  canInteract: boolean;
  canInvite: boolean;
  canUpdatePermissions: boolean;
  canRemovePermissions: boolean;
}

export interface AvatarUserPermissionData {
  user: UserInfoData;
  permissions: AvatarPermissionType;
}

//export type AvatarUserPermissionTypeData = "interact" | "contribute";
export enum AvatarPermissionType {
  None = 0,
  Interact = 1 << 0,
  Contribute = 1 << 1,
}

export interface AvatarInfoData extends Datum {
  name: string;
}

export interface CreateAvatarData {
  characterCard: CharCard;
  voice?: string;
  thumbnail?: string | null;
}

export interface UpdateAvatarData {
  characterCard: CharCard;
  thumbnail?: string | null;
}

export interface AvatarOperationData extends Datum {
  operationType: AvatarOperationTypeData;
  removeUserPermission?: AvatarRemoveUserPermissionOperationData;
  updateUserPermission?: AvatarUpdateUserPermissionOperationData;
}

export interface CreateAvatarOperationRequestData {
  operationType: AvatarOperationTypeData;
  removeUserPermission?: AvatarRemoveUserPermissionOperationData;
  updateUserPermission?: AvatarUpdateUserPermissionOperationData;
}

export interface AvatarRemoveUserPermissionOperationData {
  userId: string;
}

export interface AvatarUpdateUserPermissionOperationData {
  userId: string;
  permissions: AvatarPermissionType;
}

export type AvatarOperationTypeData =
  | "removeUserPermission"
  | "updateUserPermission";
