"use client";

import Image from "next/image";
import { X, Upload, CircleHelp } from "lucide-react";

interface ProfilePictureProps {
  profilePicture: string | null;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePicture,
  handleImageUpload,
  handleRemoveImage,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <label className="text-base text-b-black-1 font-normal tracking-spaced dark:text-white">
          Profile picture (optional)
        </label>
        <CircleHelp className="ml-2 text-b-purple-1 dark:text-[#5F488E]" size={16} />
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative">
          <span className="inline-block h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-b-grey-2 dark:bg-b-purple-5 dark:opacity-80">
            <Image
              src={profilePicture || "/placeholder-user.jpg"}
              alt="Profile"
              width={56}
              height={56}
              className="object-cover dark:text-white"
            />
          </span>
          {profilePicture && (
            <button
              onClick={handleRemoveImage}
              className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-b-grey-2 dark:bg-b-purple-5"
            >
              <X size={12} className="text-b-grey-5 dark:text-white" />
            </button>
          )}
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <span className="py-2 px-5 border border-b-purple-1 rounded-lg font-semibold text-base flex items-center
           text-b-purple-1 tracking-expanded dark:text-b-grey-6 dark:border-b-grey-6 dark:opacity-100">
            <Upload className="mr-2 dark:text-white dark:opacity-100" size={16} />
            Upload
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProfilePicture;
