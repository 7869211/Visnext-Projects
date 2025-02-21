"use client";
import { useTheme } from "next-themes";

import { useUser, useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { ChatListCompact } from "@/components/Chat/ChatListCompact";
import { MemotarListCompact } from "@/components/Memotars/MemotarListCompact";
import { Section } from "@/components/Dashboard/Section";
import ChatIcon from "@/components/icons/ChatIcon";
import GroupIcon from "@/components/icons/GroupIcon";
import { AvatarSelectionDropdown } from "@/components/Chat/AvatarSelectionDropdown";
import { useFetchAvatars } from "@/app/nextapi/avatars/api";
import { useCreateConversation } from "@/app/nextapi/conversations/api";
import { PlusIcon } from "lucide-react";
import { AvatarData } from "@/app/nextapi/avatars/models";
import { LoaderOverlay } from "@/components/LoaderOverlay";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: avatars = [], isLoading: isLoadingAvatars } = useFetchAvatars();
  const { resolvedTheme } = useTheme();

  const { mutateAsync: createConversation, isPending: isCreatingConversation } =
    useCreateConversation();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect("/");
    }
  }, [isLoaded, isSignedIn]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!isCreatingConversation && avatars.length > 0) {
        setIsDropdownOpen(open);
      }
    },
    [isCreatingConversation, avatars]
  );

  const handleAvatarSelect = useCallback(
    async (avatar: AvatarData) => {
      setIsDropdownOpen(false);
      try {
        const conversation = await createConversation({
          avatarId: avatar.id,
          data: {
            type: "interaction",
            title: `Chat with ${avatar.characterCard.data.name}`,
            description: "",
          },
        });
        router.push(`/chats?selectedConversation=${conversation.id}`);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    },
    [createConversation, router]
  );

  if (!isLoaded || !user) {
    return null;
  }

  const createChatButton = (
    <AvatarSelectionDropdown
      avatars={avatars}
      isOpen={isDropdownOpen}
      onOpenChange={handleOpenChange}
      onSelect={handleAvatarSelect}
      isLoading={isCreatingConversation}
      trigger={
        <button
          className={`ml-auto flex items-center font-montserrat text-xxs md:text-base hover:cursor-pointer ${
            avatars.length > 0 && !isCreatingConversation
              ? ""
              : "opacity-50 cursor-not-allowed"
          }`}
          disabled={isCreatingConversation || avatars.length === 0}
        >
          <PlusIcon className="mr-1 text-b-purple-1 dark:text-b-grey-6" size={18} />
          <span className="text-b-purple-1 font-semibold tracking-wide dark:text-b-grey-6">
            Create Chat
          </span>
        </button>
      }
    />
  );

  return (
    <>
      {isCreatingConversation && <LoaderOverlay />}
      <div className={`flex-1 p-6 md:p-10 max-w-full ${resolvedTheme==='dark' ? "bg-b-black-2" : ""}`}>
        <h1 className="font-semibold font-montserrat tracking-spaced text-b-black-1 mb-4 md:mb-6
         text-2xl md:text-3xl dark:text-white">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Section
              title="Chats"
              icon={
                <ChatIcon
                  className="mr-2 text-b-purple-3"
                  height={20}
                  width={20}
                />
              }
              customCreateButton={createChatButton}
            >
              <ChatListCompact user={user} />
            </Section>

            <Section
              title="Memotars"
              icon={
                <GroupIcon
                  className="mr-2 text-b-purple-3"
                  height={20}
                  width={20}
                />
              }
              createButtonHref="/memotars/create"
              createButtonText="Create Memotar"
            >
              <MemotarListCompact />
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
