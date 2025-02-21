"use client";

import React from "react";
import { SignedIn } from "@clerk/nextjs";
import HomeIcon from "@/components/icons/HomeIcon";
import ChatIcon from "@/components/icons/ChatIcon";
import GroupIcon from "@/components/icons/GroupIcon";
import MemoryIcon from "@/components/icons/MemoryIcon";
import { Menu } from "lucide-react";
import { BottomNavItem } from "./BottomNavItem";

const navigationItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    label: "Chats",
    href: "/chats",
    icon: ChatIcon,
  },
  {
    label: "Memotars",
    href: "/memotars",
    icon: GroupIcon,
  },
  {
    label: "Memories",
    href: "/memories",
    icon: MemoryIcon,
  },
  {
    label: "More",
    href: "/menu",
    icon: Menu,
  },
];

const Bottombar = () => {
  return (
    <SignedIn>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-b-grey-2 z-10
      dark:bg-b-purple-6 dark:border-[#292929]"
      >
        <div className="flex items-center max-w-screen-xl mx-auto flex-1">
          {navigationItems.map((item) => (
            <BottomNavItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </nav>
    </SignedIn>
  );
};

export default Bottombar;
