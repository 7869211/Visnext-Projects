"use client";

import { Copy } from "lucide-react";
import Image from "next/image";
import Select from "@/components/SelectComponent";
import type { AvatarInvitationData } from "@/app/nextapi/invitations/models";
import { toast } from "react-toastify";
import { AvatarPermissionType } from "@/app/nextapi/avatars/models";

const roleOptions = [
  { value: AvatarPermissionType.Contribute, label: "Collaborator (can edit)" },
  { value: AvatarPermissionType.Interact, label: "Contact (chat only)" },
];

interface AddUsersProps {
  invitations: AvatarInvitationData[];
  email: string;
  setEmail: (email: string) => void;
  handleInvite: () => void;
  handleRoleChange: (
    userId: string,
    invitationId: string,
    newRole: AvatarPermissionType
  ) => void;
  handleRemoveUser: (userId: string) => void;
  initialRole: AvatarPermissionType;
  setInitialRole: (role: AvatarPermissionType) => void;
  avatarId: string;
}

export default function AddUsers({
  invitations,
  email,
  setEmail,
  handleInvite,
  handleRoleChange,
  handleRemoveUser,
  initialRole,
  setInitialRole,
  avatarId,
}: AddUsersProps) {
  const copyInvitationLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Invitation link copied!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center">
        <label className="text-base text-b-black-1 font-normal tracking-spaced dark:text-white">
          Add users (optional)
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mt-3">
        <input
          type="email"
          placeholder="Invite others by email"
          className="flex-1 border border-b-grey-2 rounded-lg p-3 tracking-spaced 
          dark:bg-b-black-1 dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          options={roleOptions}
          value={AvatarPermissionType[initialRole]}
          onChange={(value) =>
            setInitialRole(
              AvatarPermissionType[value as keyof typeof AvatarPermissionType]
            )
          }
          className="w-full md:w-auto dark:bg-b-black-1 dark:border-[var(--dark-border-color)]"
        />
        <button
          className="bg-b-purple-1 text-white rounded-lg px-6 py-2 font-semibold 
          tracking-expanded w-full md:w-auto dark:bg-b-purple-5 dark:text-white"
          onClick={handleInvite}
        >
          Invite
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {invitations.length === 0 ? (
          <p className="text-b-grey-5 text-center py-4 tracking-spaced dark:text-white">
            Invite users to share
          </p>
        ) : (
          invitations.map((invitation) => {
            const invitationLink = `${window.location.origin}/invitation/?id=${invitation.id}&avatarId=${avatarId}`;
            return (
              <div
                key={invitation.id}
                className="flex flex-col md:flex-row items-center justify-between p-3 border border-b-grey-2 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  {invitation.avatar ? (
                    <Image
                      src="/placeholder-user.jpg"
                      alt={"User avatar"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : null}
                  <span className="text-b-black-1">{invitation.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    options={roleOptions}
                    value={AvatarPermissionType[invitation.permissions]}
                    onChange={(value) =>
                      handleRoleChange(
                        invitation.inviter.id,
                        invitation.id,
                        AvatarPermissionType[
                          value as keyof typeof AvatarPermissionType
                        ]
                      )
                    }
                    className="w-full md:w-auto"
                  />
                  <button
                    onClick={() => copyInvitationLink(invitationLink)}
                    className="text-b-purple-1 hover:text-b-purple-2 p-2"
                    title="Copy invitation link"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
