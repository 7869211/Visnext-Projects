import React, { useState } from "react";
import ProfilePicture from "@/components/Memotars/ProfilePicture";
import UploadFiles from "@/components/Memotars/UploadFiles";
import AddUsers from "@/components/Memotars/AddUsers";
import { CircleHelp, Video, Lightbulb } from "lucide-react";
import { AvatarInvitationData } from "@/app/nextapi/invitations/models";
import { AvatarPermissionType } from "@/app/nextapi/avatars/models";
import { CharCard } from "@/types/charcard.types";

interface DetailsTabProps {
  profilePicture: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  charCard: CharCard;
  setName: (name: string) => void;
  setBio: (bio: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  setPersonality: (personality: string) => void;
  setScenario: (scenario: string) => void;
  setExampleMessage: (exampleDialog: string) => void;
  setGreetings: (greetings: string) => void;
  setNotes: (notes: string) => void;
  files: { id: string; name: string; url: string; file: File }[];
  setFiles: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; url: string; file: File }[]
    >
  >;
  avatarId: string;
  users: AvatarInvitationData[];
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
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  profilePicture,
  handleImageUpload,
  handleRemoveImage,
  charCard,
  setName,
  setBio,
  nickname,
  setNickname,
  setPersonality,
  setScenario,
  setExampleMessage,
  setGreetings,
  setNotes,
  setFiles,
  files,
  avatarId,
  users,
  email,
  setEmail,
  handleInvite,
  handleRoleChange,
  handleRemoveUser,
  initialRole,
  setInitialRole,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-8 font-montserrat mt-8 md:justify-between">
      <div className="flex-1 md:max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-2xl text-b-black-1 tracking-spaced dark:text-white">
            General
          </h2>
          {/* <button
            className="bg-white rounded-lg p-4 h-fit md:hidden"
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <Lightbulb size={16} className="text-b-purple-1" />
          </button> */}
        </div>

        <ProfilePicture
          profilePicture={profilePicture}
          handleImageUpload={handleImageUpload}
          handleRemoveImage={handleRemoveImage}
        />

        <div className="mb-6">
          <div className="flex items-center">
            <label className="text-base text-b-black-1 font-normal tracking-spaced dark:text-white">
              Record Video (optional)
            </label>
            <CircleHelp
              className="ml-2 text-b-purple-1 dark:text-[#5F488E]"
              size={16}
            />
          </div>
          <button
            className="mt-3 py-2 px-5 border border-b-purple-1 rounded-lg font-semibold text-base flex
             items-center text-b-purple-1 tracking-expanded dark:text-b-grey-6 dark:border-b-grey-6 opacity-100"
            disabled
          >
            <Video className="mr-2 dark:text-white" size={16} />
            Record
          </button>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Name
            </label>
            <input
              type="text"
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
               dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              value={charCard.data.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="flex-1">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Nickname (optional)
            </label>
            <input
              type="text"
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
               dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Nickname"
            />
            <p className="text-sm tracking-spaced text-b-grey-5 mt-3 dark:text-white">
              This nickname will display in place of the full name
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
            Bio (optional)
          </label>
          <textarea
            className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3 
            dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
            rows={4}
            value={charCard.data.description}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio"
          ></textarea>
        </div>

        <UploadFiles files={files} setFiles={setFiles} />

        <div className="mb-6 flex-col md:flex-row gap-8">
          <div className="flex-1 mt-6">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Personality
            </label>
            <textarea
              rows={1}
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
               dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              value={charCard.data.personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="Personality"
            ></textarea>
          </div>
          <div className="flex-1 mt-6">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Scenario
            </label>
            <textarea
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
              dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              rows={4}
              value={charCard.data.scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Scenario"
            ></textarea>
          </div>
        </div>

        <div className="mb-6 flex-col md:flex-row gap-8">
          <div className="flex-1 mt-6">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Example Messages
            </label>
            <textarea
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
              dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              rows={4}
              value={charCard.data.mes_example}
              onChange={(e) => setExampleMessage(e.target.value)}
              placeholder="Example Messages"
            ></textarea>
          </div>
          <div className="flex-1 mt-6">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Greetings
            </label>
            <textarea
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
              dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              rows={4}
              value={
                charCard.data.first_mes + charCard.data.alternate_greetings
              }
              onChange={(e) => setGreetings(e.target.value)}
              placeholder="Greetings"
            ></textarea>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-8">
          <div className="flex-1 ">
            <label className="block text-base text-b-black-1 tracking-spaced dark:text-white">
              Notes
            </label>
            <textarea
              className="block w-full border border-b-grey-2 rounded-lg p-3 tracking-spaced mt-3
              dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              rows={4}
              value={charCard.data.creator_notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            ></textarea>
          </div>
        </div>

        <AddUsers
          invitations={users}
          email={email}
          setEmail={setEmail}
          handleInvite={handleInvite}
          handleRoleChange={handleRoleChange}
          handleRemoveUser={handleRemoveUser}
          initialRole={initialRole}
          setInitialRole={setInitialRole}
          avatarId={avatarId}
        />
      </div>

      <div
        className="hidden md:flex md:self-start text-b-black-1 text-base tracking-spaced bg-b-grey-1 
      rounded-2xl shadow p-5 dark:bg-b-purple-5 "
      >
        <div className="dark:bg-b-black-2 h-8 w-8 mr-2 mt-1 rounded flex items-center justify-center">
          <Lightbulb size={16} className="text-b-purple-1 dark:text-b-grey-6" />
        </div>
        <div className="max-w-xs dark:text-white">
          <p>
            While most fields are optional, the more information you provide the
            better!
          </p>
          <p className="mt-3">
            By filling out all fields and uploading files you&apos;ll create a
            more accurate and complete memotar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
