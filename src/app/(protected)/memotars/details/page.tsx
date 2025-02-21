"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import type { AvatarInvitationData } from "@/app/nextapi/invitations/models";
import DetailsTab from "@/components/Memotars/DetailsTab";
import AddMemories from "@/components/Memotars/AddMemories";
import { useFetchAvatar, useUpdateAvatar } from "@/app/nextapi/avatars/api";
import { useUploadFile } from "@/app/nextapi/files/api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { getHeadersInitializer, removeData } from "@/app/nextapi/utils";
import {
  useCreateAvatarInvitation,
  useUpdateAvatarInvitation,
} from "@/app/nextapi/invitations/api";
import { AvatarPermissionType } from "@/app/nextapi/avatars/models";
import { CharCard } from "@/types/charcard.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { errorToast, successToast } from "@/components/ui/toast";
import {
  ErrorSecondToastStyle,
  SuccessSecondToastStyle,
} from "@/lib/toastUtils";

const tabs = [
  { id: "details", label: "DETAILS" },
  { id: "memories", label: "MEMORIES" },
];

export default function DetailsMemotarPage() {
  const { getToken } = useAuth();
  const FUNCTION_APP_URL = process.env.NEXT_PUBLIC_FUNCTION_APP_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [nickname, setNickname] = useState<string>("");
  const [files, setFiles] = useState<
    { id: string; name: string; url: string; file: File }[]
  >([]);
  const [invitedUsers, setInvitedUsers] = useState<AvatarInvitationData[]>([]);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialRole, setInitialRole] = useState<AvatarPermissionType>(
    AvatarPermissionType.Interact
  );
  const { mutateAsync: updateAvatar } = useUpdateAvatar();
  const { mutateAsync: uploadFile } = useUploadFile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const { mutateAsync: createInvitation } = useCreateAvatarInvitation({
    onError: (error) => {
      console.error("Error creating invitation:", error);
      toast.error("Failed to create invitation. Please try again.");
    },
  });
  const { mutateAsync: updateInvitation } = useUpdateAvatarInvitation({
    onError: (error) => {
      console.error("Error updating invitation:", error);
      toast.error("Failed to update invitation. Please try again.");
    },
  });

  // Handle selecting memotar details from query params
  useEffect(() => {
    const avatarId = searchParams.get("id");
    setAvatarId(avatarId);
  }, [searchParams]);

  // Avoid fetching until avatarId is available
  const {
    data: memotarDetails,
    isLoading: isLoadingDetails,
    error: fetchDetailsError,
    refetch: refetchDetails,
  } = useFetchAvatar(avatarId ? avatarId : undefined); // Only fetch when avatarId is valid

  const [charCard, setCharCard] = useState<CharCard>({
    spec: 'chara_card_v2',
    spec_version: '2.0',
    create_date: currentDate || new Date(),
    data: {
      name: 'Your Memotar',
      description: '',
      personality: '',
      first_mes: '',
      mes_example: '',
      scenario: 'A conversation between you and your memotar',
      creator: '',
      creator_notes: '',
      system_prompt: '',
      post_history_instructions: '',
      character_version: '',
      tags: null,
      alternate_greetings: null,
      extensions: {
        talkativeness: '0.5',
        fav: false,
        world: '',
        depth_prompt: null,
      },
    },
  });

  const handleDeleteMemotar = async () => {
    try {
      if (!avatarId) {
        console.error("Avatar ID is missing.");
        return;
      }
      const response = await removeData(
        `${FUNCTION_APP_URL}/api/avatars/${avatarId}`,
        getHeadersInitializer(getToken)
      );
      setIsDialogOpen(false);
      successToast("Memotar deleted!", SuccessSecondToastStyle, resolvedTheme)
      router.push("/memotars");
    } catch (error) {
      setIsDialogOpen(false);
      console.error("An error occurred while deleting the memotar:", error);
      errorToast("Failed to delete memotar! Please try again", ErrorSecondToastStyle, resolvedTheme);
    }
  };

  const handleSetName = (newName: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        name: newName,
      },
    }));
  };

  const handleSetBio = (newBio: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        description: newBio,
      },
    }));
  };

  const handleSetPersonality = (newPersonality: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        personality: newPersonality,
      },
    }));
  };

  const handleSetScenario = (newScenario: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        scenario: newScenario,
      },
    }));
  };

  const handleSetExampleMessage = (newExampleMessage: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        mes_example: newExampleMessage,
      },
    }));
  };

  const handleSetNotes = (newNotes: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        creator_notes: newNotes,
      },
    }));
  };

  const handleSetGreetings = (newGreetings: string) => {
    setCharCard((prev) => ({
      ...prev,
      data: {
        ...prev?.data,
        alternate_greetings: newGreetings.split(","),
      },
    }));
  };

  useEffect(() => {
    if (memotarDetails?.characterCard) {
      setCharCard(memotarDetails.characterCard);
    }
    if (memotarDetails && !isLoadingDetails) {
      setProfilePicture(memotarDetails.thumbnail ?? "");
    }
  }, [memotarDetails, isLoadingDetails]);

  useEffect(() => {
    return () => {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
    };
  }, [profilePicture]);

  // Handle errors from fetching memotar details
  useEffect(() => {
    if (fetchDetailsError) {
      console.error("Failed to load memotar:", fetchDetailsError);
      toast.error("Failed to load memotar. Please try again.");
    }
  }, [fetchDetailsError]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
      const newUrl = URL.createObjectURL(files[0]);
      setProfilePicture(newUrl);
      setProfilePictureFile(files[0]);
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    if (profilePicture) {
      URL.revokeObjectURL(profilePicture);
    }
    setProfilePicture(null);
    setProfilePictureFile(null);
  };

  const handleInvite = async () => {
    if (!email || !avatarId) return;

    try {
      // Create invitation with permissions based on role
      const permissions: AvatarPermissionType = initialRole;

      const invitation = await createInvitation({
        avatarId,
        data: {
          permissions,
          email,
        },
      });

      // Add user to local state with invitation details
      const newUser: AvatarInvitationData = {
        id: invitation.id,
        email,
        status: "pending",
        permissions,
        inviter: invitation.inviter,
        avatar: invitation.avatar,
        accessControl: invitation.accessControl,
      };

      setInvitedUsers([...invitedUsers, newUser]);
      setEmail("");
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast.error("Failed to create invitation. Please try again.");
    }
  };

  const handleRoleChange = async (
    userId: string,
    invitationId: string,
    newRole: AvatarPermissionType
  ) => {
    if (!avatarId) return;

    try {
      const permissions: AvatarPermissionType = newRole;

      const updatedInvitation = await updateInvitation({
        avatarId,
        invitationId,
        data: {
          permissions,
        },
      });

      const updatedUsers = invitedUsers.map((user) =>
        user.id === invitationId
          ? {
              ...user,
              permissions,
              id: updatedInvitation.id,
              inviter: updatedInvitation.inviter,
              avatar: updatedInvitation.avatar,
              accessControl: updatedInvitation.accessControl,
            }
          : user
      );
      setInvitedUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating invitation:", error);
      toast.error("Failed to update invitation. Please try again.");
    }
  };

  const handleRemoveUser = (userId: string) => {
    setInvitedUsers(invitedUsers.filter((user) => user.id !== userId));
  };

  const handleUpdate = async () => {
    if (!avatarId || isUpdating) return;
    setIsUpdating(true);

    try {
      let thumbnailUrl = null;
      if (profilePicture && profilePictureFile) {
        const uploadResult = await uploadFile({
          avatarId,
          usage: "conversationAttachment",
          file: {
            id: crypto.randomUUID(),
            file: profilePictureFile,
          },
        });

        if (uploadResult?.upload?.uploadUrl) {
          thumbnailUrl = uploadResult.upload.uploadUrl;
        }
      }

      // Upload all additional files
      const fileUploadPromises = files.map((file) =>
        uploadFile({
          avatarId,
          usage: "conversationAttachment",
          file: {
            id: file.id,
            file: file.file,
          },
        })
      );

      await Promise.all(fileUploadPromises);

      // Update avatar with thumbnail
      await updateAvatar({
        id: avatarId,
        data: {
          characterCard: charCard,
          thumbnail: thumbnailUrl,
        },
      });
      successToast(
        "Memotar updated successfully!",
        SuccessSecondToastStyle,
        resolvedTheme
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating memotar:", error);
      errorToast(
        "Error updating memotar:",
        ErrorSecondToastStyle,
        resolvedTheme
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!avatarId || isLoadingDetails) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-b-purple-1"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-montserrat dark:bg-[#1A1A1A]">
      <div className="flex-shrink-0 flex items-center justify-between p-6 md:p-10">
        <h1 className="text-b-black-1 font-semibold tracking-expanded text-2xl md:text-3xl dark:text-white">
          Memotar details
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsDialogOpen(true)}
            className={` text-[#3D2E5B] font-semibold tracking-expanded
                  px-5 py-2 text-xs md:text-base dark:text-[#CEBEE7]${
                    isUpdating ? "opacity-50 cursor-not-allowed" : ""
                  }`}
          >
            Delete
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`bg-b-purple-1 text-white rounded-lg flex items-center font-semibold tracking-expanded
               px-5 py-2 text-xs md:text-base dark:bg-b-purple-1 dark:text-white${
                 isUpdating ? "opacity-50 cursor-not-allowed" : ""
               }`}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[420px] max-h-[260px] border border-[#F4F2F7] bg-white">
          <DialogHeader>
            <DialogTitle className="my-4">Delete memotar?</DialogTitle>
            <DialogDescription className="text-base font-montserrat">
              Are you sure you want to delete this memotar? Any contacts they
              have will no longer be able to interact with them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-white text-[#3D2E5B] font-semibold border border-[#3D2E5B] rounded-lg hover:bg-b-grey-1"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#F34213] text-white font-semibold rounded-lg hover:bg-red-600"
              onClick={handleDeleteMemotar}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 flex flex-col px-6 md:px-10">
        <div className="font-montserrat flex flex-col flex-1">
          <div className="flex-shrink-0 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold tracking-expanded relative ${
                  activeTab === tab.id
                    ? "text-b-black-1 dark:text-white"
                    : "text-b-grey-5 hover:text-b-black-1 dark:text-white  dark:hover:text-b-grey-6"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-b-black-1 dark:bg-white" />
                )}
              </button>
            ))}
          </div>

          {activeTab === "details" && (
            <>
              <DetailsTab
                profilePicture={profilePicture}
                handleImageUpload={handleImageUpload}
                handleRemoveImage={handleRemoveImage}
                charCard={charCard}
                setName={handleSetName}
                setBio={handleSetBio}
                setPersonality={handleSetPersonality}
                setExampleMessage={handleSetExampleMessage}
                setGreetings={handleSetGreetings}
                setNotes={handleSetNotes}
                setScenario={handleSetScenario}
                nickname={nickname}
                setNickname={setNickname}
                files={files}
                setFiles={setFiles}
                avatarId={avatarId}
                users={invitedUsers}
                email={email}
                setEmail={setEmail}
                handleInvite={handleInvite}
                handleRoleChange={handleRoleChange}
                handleRemoveUser={handleRemoveUser}
                initialRole={initialRole}
                setInitialRole={setInitialRole}
              />
            </>
          )}
          {activeTab === "memories" && (
            <div className="flex-1">
              <AddMemories avatarId={avatarId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
