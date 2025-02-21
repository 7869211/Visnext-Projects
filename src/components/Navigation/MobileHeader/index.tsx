import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Logo from "@/assets/m-logo.png";
import darkLogo from "@/assets/d-logo.png";
import { useTheme } from "next-themes";

const MobileHeader = () => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="flex justify-between items-center px-4 py-3 bg-white border-b border-b-grey-2 md:hidden h-22
     dark:bg-b-purple-6 dark:border-[#292929]"
    >
      <div className="flex items-center">
        <Image
          src={resolvedTheme === "dark" ? darkLogo : Logo}
          alt="Memotar Logo"
          className="h-10 w-auto dark:w-[123px] dark:w-[200px]"
        />
      </div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-6 w-6",
          },
        }}
      />
    </div>
  );
};

export default MobileHeader;
