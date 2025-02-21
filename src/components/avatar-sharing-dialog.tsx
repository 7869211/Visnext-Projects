import { useFetchAvatar } from "@/app/nextapi/avatars/api";
import { AvatarData, AvatarPermissionType } from "@/app/nextapi/avatars/models";
import { UserInfoData } from "@/app/nextapi/users/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { v0props } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { create } from "zustand";

interface DialogProps {
  isOpen: boolean;
  onOpen: (avatarId: string) => void;
  onClose: () => void;
  avatarId?: string;
  sharingLink: string;
  setSharingLink: (link: string) => void;
}

const useAvatarSharingDialogStore = create<DialogProps>((set) => ({
  isOpen: false,
  onOpen: (avatarId: string) =>
    set({ isOpen: true, avatarId, sharingLink: "" }),
  onClose: () => set({ isOpen: false }),
  avatarId: undefined,
  sharingLink: "",
  setSharingLink: (link: string) => set({ sharingLink: link }),
}));

export function useAvatarSharingDialog() {
  return useAvatarSharingDialogStore();
}

interface Props {
  onGenerateLink: (
    avatar: AvatarData,
    permissions: AvatarPermissionType
  ) => Promise<string>;
  onRemoveUserPermission: (
    avatar: AvatarData,
    user: UserInfoData
  ) => Promise<void>;
  onUpdateUserPermission: (
    avatar: AvatarData,
    user: UserInfoData,
    permissions: AvatarPermissionType
  ) => Promise<void>;
  onClosed: () => Promise<void>;
}

export default function AvatarSharingDialog({
  onGenerateLink,
  onRemoveUserPermission,
  onUpdateUserPermission,
  onClosed,
}: Props) {
  const { isOpen, onClose, avatarId, sharingLink, setSharingLink } =
    useAvatarSharingDialogStore();

  const {
    data: avatar,
    isLoading: isAvatarLoading,
    error: fetchAvatarError,
    refetch: refetchAvatar,
  } = useFetchAvatar(avatarId);

  return (
    <Dialog
      onOpenChange={async () => {
        onClose();
        await onClosed();
      }}
      open={isOpen}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Avatar Collaboration</DialogTitle>
          <DialogDescription>{avatar && avatar.characterCard.data.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fetchAvatarError && <span>Unable to load data...</span>}
          {isAvatarLoading && <span>Loading...</span>}
          {avatar && avatar.accessControl.canInvite && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="shrink-0">
                      <PowerIcon className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {
                        const link = await onGenerateLink(
                          avatar,
                          AvatarPermissionType.Contribute
                        );
                        setSharingLink(link);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>Contribution Invitation</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const link = await onGenerateLink(
                          avatar,
                          AvatarPermissionType.Interact
                        );
                        setSharingLink(link);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>Interaction Invitation</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const link = await onGenerateLink(
                          avatar,
                          AvatarPermissionType.Contribute |
                            AvatarPermissionType.Interact
                        );
                        setSharingLink(link);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>Contribution and Interaction Invitation</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Input
                  type="text"
                  placeholder={`${window.location.protocol}://${window.location.hostname}/invitation`}
                  className="flex-1"
                  readOnly
                  value={sharingLink || ""}
                />

                <Button
                  variant="secondary"
                  className="shrink-0"
                  disabled={sharingLink === undefined}
                  onClick={() =>
                    navigator.clipboard.writeText(sharingLink ?? "")
                  }
                >
                  <ClipboardIcon className="h-4 w-4 mr-2" />
                </Button>
              </div>
            </div>
          )}
          {avatar && (avatar.sharedWith ?? []).length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">People with access</h4>
              <div className="grid gap-6">
                {avatar.sharedWith?.map((p) => (
                  <div
                    key={p.user.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {p.user?.firstName?.[0] ?? ""}
                          {p.user?.lastName?.[0] ?? ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {p.user.firstName} {p.user.lastName} ({p.user.id})
                        </p>
                      </div>
                      {(p.permissions & AvatarPermissionType.Contribute) ===
                        AvatarPermissionType.Contribute && <ContributionIcon />}
                      {(p.permissions & AvatarPermissionType.Interact) ===
                        AvatarPermissionType.Interact && <InteractionIcon />}
                    </div>
                    {avatar.accessControl.canRemovePermissions && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          await onRemoveUserPermission(avatar, p.user);
                          await refetchAvatar();
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">
                          Remove {p.user.firstName} {p.user.lastName}
                        </span>
                      </Button>
                    )}
                    {avatar.accessControl.canUpdatePermissions && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" className="shrink-0">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={async () => {
                              await onUpdateUserPermission(
                                avatar,
                                p.user,
                                AvatarPermissionType.Interact
                              );
                              await refetchAvatar();
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>Interaction Only</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              await onUpdateUserPermission(
                                avatar,
                                p.user,
                                AvatarPermissionType.Interact |
                                  AvatarPermissionType.Contribute
                              );
                              await refetchAvatar();
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>Contribution and Interaction</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span className="sr-only">Not shared with anyone</span>
          )}
        </div>
        <DialogFooter>
          <Button className="ml-auto" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClipboardIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function EditIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5l4 4-9 9-4.5 1L8 13.5l9-9z" />
    </svg>
  );
}

function PowerIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
    </svg>
  );
}

function XIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ContributionIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6l-4.35 4.35a1.5 1.5 0 0 1-2.12 0l-1.41-1.41a1.5 1.5 0 0 0-2.12 0L4 16v4h4l7.76-7.76a1.5 1.5 0 0 0 0-2.12l-1.41-1.41a1.5 1.5 0 0 1 0-2.12L20 6z" />
      <path d="M16 16v6" />
      <path d="M12 20h8" />
    </svg>
  );
}

function InteractionIcon(props: v0props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
      <path d="M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z" />
      <path d="M17 7h.01" />
      <path d="M22 12h.01" />
      <path d="M17 17h.01" />
      <path d="M22 7h.01" />
    </svg>
  );
}
