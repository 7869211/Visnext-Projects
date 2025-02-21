"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "react-toastify";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ErrorSecondToastStyle, SuccessSecondToastStyle } from "@/lib/toastUtils";
import { errorToast, successToast } from "@/components/ui/toast";

const toastConfig = {
  position: "top-center" as const,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

export default function SettingsPage() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState((user?.unsafeMetadata.bio as string) || "");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), [resolvedTheme, setTheme]);

  const handleSaveChanges = async () => {
    try {
      await user?.update({
        firstName: firstName,
        lastName: lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          bio: bio,
        },
      });
      successToast("Profile updated successfully!", SuccessSecondToastStyle, resolvedTheme)
    } catch (error) {
      errorToast("Failed to update profile", ErrorSecondToastStyle, resolvedTheme);
    }
  };

  const handlePasswordChange = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
      });
      successToast("Password changed successfully!", SuccessSecondToastStyle, resolvedTheme)
      setIsPasswordModalOpen(false);
    } catch (error) {
      errorToast(error instanceof Error ? error.message : "Failed to change password", ErrorSecondToastStyle, resolvedTheme);
    }
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      errorToast("Please upload a JPG, JPEG, or PNG file", ErrorSecondToastStyle, resolvedTheme);
      return;
    }

    try {
      await user?.setProfileImage({ file });
      successToast("Profile picture updated successfully!", SuccessSecondToastStyle, resolvedTheme)
    } catch (error) {
      errorToast("Failed to update profile picture", ErrorSecondToastStyle, resolvedTheme);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      await user?.setProfileImage({ file: null });
      successToast("Profile picture removed successfully!", SuccessSecondToastStyle, resolvedTheme)
    } catch (error) {
      errorToast("Failed to remove profile picture", ErrorSecondToastStyle, resolvedTheme);
    }
  };

  return (
    <div className="p-4 md:p-10 flex justify-center dark:bg-b-black-2">
      <div className="w-full md:w-[60%]">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <h1 className="font-semibold font-montserrat tracking-spaced text-b-black-1 text-xl md:text-3xl dark:text-white">
            Account
          </h1>
          <button
            onClick={handleSaveChanges}
            className="px-4 py-2 bg-[#4A3880] text-white rounded-lg hover:bg-opacity-90 
            transition-colors font-montserrat text-sm md:text-base whitespace-nowrap dark:bg-b-purple-1 opacity-100 dark:text-white"
          >
            Save changes
          </button>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Profile Picture Section */}
          <div className="space-y-3">
            <label className="block text-base font-montserrat tracking-spaced text-b-black-1 font-normal dark:text-white">
              Profile picture (optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 group">
                <Image
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full object-cover border border-gray-200"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              {user?.hasImage && (
                <button
                  onClick={handleRemoveProfilePicture}
                  className="text-red-600 hover:text-red-700 text-sm font-montserrat dark:text-white"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <label
                htmlFor="firstName"
                className="block text-base tracking-spaced font-montserrat text-b-black-1 font-normal 
                dark:text-white"
              >
                First name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg bg-[rgb(var(--background-secondary-rgb-light))] 
                font-montserrat text-b-black-1 dark:bg-b-black-1 dark:text-white dark:placeholder-b-grey-0 dark:border-[var(--dark-border-color)]"
              />
            </div>
            <div className="space-y-3">
              <label
                htmlFor="lastName"
                className="block text-base tracking-spaced font-montserrat text-b-black-1 font-normal dark:text-white"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg bg-[rgb(var(--background-secondary-rgb-light))] 
                font-montserrat text-b-black-1 dark:bg-b-black-1 dark:text-white dark:placeholder-b-grey-0 dark:border-[var(--dark-border-color)]"
              />
            </div>
          </div>

          {/* Bio Field */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <label
                htmlFor="bio"
                className="block text-base tracking-spaced font-montserrat text-b-black-1 font-normal dark:text-white"
              >
                Bio (optional)
              </label>
            </div>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg h-24 resize-none bg-[rgb(var(--background-secondary-rgb-light))]
               font-montserrat text-b-black-1 tracking-spaced dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              placeholder="Enter bio"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="block text-base tracking-spaced font-montserrat text-b-black-1 font-normal dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.primaryEmailAddress?.emailAddress || ""}
              className="w-full p-2 border border-gray-200 rounded-lg bg-gray-100 font-montserrat text-gray-500 
              cursor-not-allowed tracking-spaced dark:bg-b-black-1 dark:text-b-grey-0 dark:border-[var(--dark-border-color)]"
              disabled
            />
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-base font-bold text-b-grey-3 font-montserrat underline tracking-spaced"
            >
              Change password
            </button>

            {/* Light/Dark Theme Toggle */}
            <div>
              <label className="block text-base font-montserrat tracking-spaced text-b-black-1 font-normal dark:text-white mb-2">
                Color Theme
              </label>
              <div className="inline-flex border border-[#55407F] rounded-md overflow-hidden dark:border-[var(--dark-border-color)]">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center px-4 py-2 w-48 ${
                    resolvedTheme === "light"
                      ? "bg-[#55407F]  text-white"
                      : "bg-white text-black dark:bg-b-black-2 dark:text-white"
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center px-4 py-2 w-48 ${
                    resolvedTheme === "dark"
                      ? "bg-[#4A3880] text-white"
                      : "bg-white text-black dark:bg-b-black-2 dark:text-white"
                  }`}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={handlePasswordChange}
        />
      </div>
    </div>
  );
}
