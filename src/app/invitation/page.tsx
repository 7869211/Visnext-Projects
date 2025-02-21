"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { v0props } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
  useCreateAvatarInvitationOperation,
  useFetchAvatarInvitation,
} from "../nextapi/invitations/api";
import { AvatarPermissionType } from "../nextapi/avatars/models";

type Props = {
  searchParams: { avatarId: string; id: string };
};

// TODO: Export component
// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: `Deep Soul - Invitation`,
//   };
// }

export default function CreatePage({
  searchParams: { avatarId, id: invitationId },
}: Props) {
  const { userId } = useAuth();
  const router = useRouter();

  const { data: invitation, isLoading: isInvitationLoading } =
    useFetchAvatarInvitation(avatarId, invitationId);

  const {
    mutate: createInvitationResponse,
    isPending: isCreateInvitationResponsePending,
    isPaused: isCreateInvitationResponsePaused,
  } = useCreateAvatarInvitationOperation({
    onError: (_, variables) => {
      sendGAEvent("event", "avatar_invitation_response_failed", {
        user_id: userId,
        avatar_id: avatarId,
        invitation_id: invitationId,
        accepted: variables.data.respond?.accepted,
      });
    },
    onSuccess: (_, variables) => {
      sendGAEvent("event", "avatar_invitation_responded", {
        user_id: userId,
        avatar_id: avatarId,
        invitation_id: invitationId,
        accepted: variables.data.respond?.accepted,
      });
      router.push("/");
    },
  });

  const respondInvitation = useCallback(
    (accepted: boolean) => {
      createInvitationResponse({
        avatarId,
        invitationId,
        data: {
          operationType: "respond",
          respond: {
            accepted,
          },
        },
      });
    },
    [avatarId, createInvitationResponse, invitationId]
  );

  useEffect(() => {
    if (invitation?.accessControl.canAutoAccept) {
      respondInvitation(true);
    }
  }, [invitation, respondInvitation]);

  const canUseInvitation =
    invitation?.accessControl.canAccept || invitation?.accessControl.canReject;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        {isInvitationLoading
          ? "Loading..."
          : !canUseInvitation
          ? "Invitation unavailable."
          : invitation && (
              <Card className="w-full max-w-md p-6 space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <div className="mt-4 text-xl font-bold">
                    {invitation.avatar.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <p>
                    {`You have been invited to collaborate on an avatar. This
              means you will be able to interact with and/or contribute to the
              avatar's appearance and customization.`}
                  </p>
                  {(invitation.permissions & AvatarPermissionType.Interact) ===
                    AvatarPermissionType.Interact && (
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>Interact: Experience the avatar</span>
                    </div>
                  )}
                  {(invitation.permissions &
                    AvatarPermissionType.Contribute) ===
                    AvatarPermissionType.Contribute && (
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5 text-primary" />
                      <span>
                        Contribute: Contribute background information and
                        memories of the avatar.
                      </span>
                    </div>
                  )}
                </div>
                {invitation.accessControl.canAutoAccept ? (
                  <span>
                    Already have access to avatar, automatically accepting
                    invitation...
                  </span>
                ) : (
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={async () => await respondInvitation(false)}
                      disabled={
                        isCreateInvitationResponsePaused ||
                        isCreateInvitationResponsePending ||
                        !invitation?.accessControl.canReject
                      }
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={async () => await respondInvitation(true)}
                      disabled={
                        isCreateInvitationResponsePaused ||
                        isCreateInvitationResponsePending ||
                        !invitation?.accessControl.canAccept
                      }
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </Card>
            )}
      </div>
    </main>
  );
}

function CheckIcon(props: v0props) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
