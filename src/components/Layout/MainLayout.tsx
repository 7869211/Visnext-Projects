"use client";

import Sidebar from "@/components/Sidebar";
import Bottombar from "@/components/Navigation/BottomBar";
import MobileHeader from "@/components/Navigation/MobileHeader";
import { useUser } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();  

  return (
    <div className="flex flex-col min-h-screen h-screen bg-[rgb(var(--background-main-rgb-light))]">
      {/* Mobile Header - visible on mobile only */}
      <div className="md:hidden">
        <MobileHeader />
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar user={user} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto pb-[72px] md:pb-0 pt-0 dark:bg-b-black-2">
          {children}
        </div>
      </div>

      {/* Bottom Navigation - visible on mobile only */}
      <div className="md:hidden">
        <Bottombar />
      </div>
    </div>
  );
}
