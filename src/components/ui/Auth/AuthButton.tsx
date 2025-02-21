import React, { useState } from "react";
import Image from "next/image";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { MeetingPlatforms } from "@/common/enums";

interface AuthButtonProps {
  label: string;
  iconSrc: string;
  altText: string;
  provider: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  label,
  iconSrc,
  altText,
  provider,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPlatform } = useRegistrationStore();

  const generateNonce = (): string => {
    return Math.floor(1000000 + Math.random() * 9000000).toString(); // Generate a 7-digit string nonce
  };

  const handleClick = async () => {
    setIsLoading(true);
    const platform =
      provider === "google"
        ? MeetingPlatforms.GOOGLE_MEET
        : provider === "outlook"
        ? MeetingPlatforms.MICROSOFT_TEAMS
        : MeetingPlatforms.OTHER;
    setPlatform(platform);
    localStorage.setItem("platform", platform);

    const nonce = generateNonce();
    const authUrl =
      process.env.NEXT_PUBLIC_AUTH_BASE_URL || "https://services.meetchase.ai";

    if (!authUrl) {
      console.error("Authentication URL is not configured.");
      setIsLoading(false);
      return;
    }

    const redirectUrl = `${authUrl}/users/auth/v2/${provider}?nonce=${nonce}`;
    try {
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Error initiating authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full gap-2 px-3 py-4 border-[#BA54BA] border h-[56px] rounded ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
      suppressHydrationWarning={true}
    >
      <Image src={iconSrc} alt={altText} width={24} height={24} />
      <span>{isLoading ? "Redirecting..." : label}</span>
    </button>
  );
};

export default AuthButton;
