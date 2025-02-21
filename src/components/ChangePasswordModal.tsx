import React, { useState, useEffect } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setCurrentPassword("");
        setNewPassword("");
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const passwordRequirements = {
    uppercase: /[A-Z]/.test(newPassword),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    minLength: newPassword.length >= 8,
  };

  const RequirementIcon = ({ met }: { met: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={met ? "#16A34A" : "#DC2626"}
      strokeWidth="2"
      className="shrink-0 dark:text-white"
    >
      {met ? (
        <path d="M20 6L9 17l-5-5" />
      ) : (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      )}
    </svg>
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(passwordRequirements).every(Boolean)) {
      try {
        await onSave(currentPassword, newPassword);
        setCurrentPassword("");
        setNewPassword("");
        onClose();
      } catch (error) {
        throw error; // Let the parent component handle the error
      }
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setShowNewPassword(false);
    setShowCurrentPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg p-8 w-full max-w-md relative dark:bg-b-black-2">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-montserrat mb-8 tracking-spaced font-bold dark:text-white">
          Change password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-base font-montserrat text-b-black-1 tracking-spaced dark:text-white">
              Current password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2 pr-10 border border-gray-200 rounded-lg bg-[rgb(var(--background-secondary-rgb-light))] 
                font-montserrat dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {showCurrentPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-base font-montserrat text-b-black-1 tracking-spaced dark:text-white">
              New password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full p-2 pr-10 border border-gray-200 rounded-lg bg-[rgb(var(--background-secondary-rgb-light))]
                 font-montserrat dark:bg-b-black-1 dark:text-white dark:border-[var(--dark-border-color)] dark:placeholder-b-grey-0"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {showNewPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
                  ) : (
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" />
                  )}
                </svg>
              </button>
            </div>
            {/* Password Requirements */}
            <div className="space-y-2 mt-4">
              <div
                className={`flex items-center gap-2 ${
                  passwordRequirements.uppercase
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <RequirementIcon met={passwordRequirements.uppercase} />
                <span className="text-sm font-montserrat dark:text-white">
                  Must contain 1 uppercase letter
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordRequirements.specialChar
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <RequirementIcon met={passwordRequirements.specialChar} />
                <span className="text-sm font-montserrat dark:text-white">
                  Must contain 1 special character
                </span>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  passwordRequirements.minLength
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <RequirementIcon met={passwordRequirements.minLength} />
                <span className="text-sm font-montserrat dark:text-white">
                  Must have at least 8 characters
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-b-purple-1 rounded-lg font-montserrat text-b-purple-1 
              font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !Object.values(passwordRequirements).every(Boolean) ||
                currentPassword.length === 0 ||
                newPassword.length === 0
              }
              className="px-6 py-2 bg-[#4A3880] text-white rounded-lg hover:bg-opacity-90 transition-colors font-montserrat disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
