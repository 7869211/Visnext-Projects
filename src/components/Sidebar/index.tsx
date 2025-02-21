"use client";

import React , {useState,useEffect} from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import type { User } from "@/types/user.types";
import HomeIcon from "@/components/icons/HomeIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import GroupIcon from "@/components/icons/GroupIcon";
import MemoryIcon from "@/components/icons/MemoryIcon";
import Logo from "@/assets/logo.png";
import darkLogo from "@/assets/d-logo.png"
import NavLink from "./NavLink";
import { useTheme } from "next-themes";

interface SidebarProps {
  user: User;
}

const navigationItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: <HomeIcon className="mr-2 text-b-black-1 dark:text-white" />,
  },
  {
    label: "Chats",
    href: "/chats",
    icon: <ChatIcon className="mr-2 text-b-black-1 dark:text-white" />,
  },
  {
    label: "Memotars",
    href: "/memotars",
    icon: <GroupIcon className="mr-2 text-b-black-1 dark:text-white" />,
  },
  {
    label: "Memories",
    href: "/memories",
    icon: <MemoryIcon className="mr-2 text-b-black-1 dark:text-white" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
   const { resolvedTheme } = useTheme();

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-full 
    bg-[rgb(var(--background-secondary-rgb-light))] border-r-2 border-gray-200
    dark:bg-[#2F2346] dark:border-[var(--dark-border-color)]">
     <div className="flex items-center mb-4">
        <Image
          src={resolvedTheme === 'dark' ? darkLogo : Logo} 
          alt="Memotar Logo"
          width={500}
          height={248}
          priority
          className="dark:mb-8 dark:mt-9 w-full h-auto"
        />
      </div>
      <nav className="flex flex-col pl-6">
        {navigationItems.map((item) => (
          <NavLink key={item.label} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex items-center mb-4 pl-6 pt-6 border-t border-b-grey-2 dark:border-t-[var(--dark-border-color)]">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-6 w-6",
              },
            }}
          />
          <h3 className="text-base ml-2 font-semibold font-montserrat tracking-spaced text-b-black-1 
          dark:text-white">
            {user?.firstName || "User"}
          </h3>
        </SignedIn>
      </div>

      <div className="flex flex-col pl-6 pb-6">
        <NavLink href="/settings">Settings</NavLink>
        <NavLink href="/docs">Docs</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
