import { Datum } from "../models";
import { AvatarInfoData, AvatarPermissionType } from "../avatars/models";
import { UserInfoData } from "../users/models";

export interface AvatarInvitationData extends Datum {
  status: AvatarInvitationStatusData;
  permissions: AvatarPermissionType;
  inviter: UserInfoData;
  avatar: AvatarInfoData;
  accessControl: AvatarInvitationAccessControlData;
  email: string;
}

export type AvatarInvitationStatusData = "pending" | "accepted" | "rejected";

export interface AvatarInvitationAccessControlData {
  canAccept: boolean;
  canReject: boolean;
  canAutoAccept: boolean;
}

export interface CreateAvatarInvitationData {
  permissions: AvatarPermissionType;
  email: string;
}

// NB: Can't update email address after invitation created.
//     In that case, create a new invitation for the other email address.
export interface UpdateAvatarInvitationData {
  permissions: AvatarPermissionType;
}

export interface AvatarInvitationOperationData {
  operationType: AvatarInvitationOperationTypeData;
  respond?: AvatarInvitationRespondOperationData;
}

export interface CreateAvatarInvitationOperationData {
  operationType: AvatarInvitationOperationTypeData;
  respond?: AvatarInvitationRespondOperationData;
}

export type AvatarInvitationOperationTypeData = "respond";

export interface AvatarInvitationRespondOperationData {
  accepted: boolean;
}
