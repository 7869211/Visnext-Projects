import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";
import Link from "next/link";
import LogoWithBrand from "@/components/ui/Auth/LogoWithBrand";
import { useRouter } from "next/router";

const items = [
  {
    title: "Home",
    url: "/home",
  },
  {
    title: "Contacts",
    url: "/contacts",
  },
  {
    title: "Campaigns",
    url: "#",
  },
  {
    title: "Human Intervention",
    url: "/human-intervention/jobs",
  },
  {
    title: "Meetings",
    url: "#",
  },
  {
    title: "Reporting",
    url: "#",
  },
  {
    title: "Campaign Setup",
    url: "/campaign",
  },
  {
    title: "Knowledge Base",
    url: "#",
  },
  {
    title: "Organisation Settings",
    url: "#",
  },
  {
    title: "Account Settings",
    url: "#",
  },
];

export const AppSidebar = () => {
  const router = useRouter(); // Access the current router (pathname)

  return (
    <Sidebar>
      <SidebarHeader>
        <LogoWithBrand logoWidth={36} logoHeight={36} brandHeight={26} />
      </SidebarHeader>
      <SidebarContent>
        <span className="text-white">{"StreamSpark"}</span>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = router.pathname === item.url; // Check if the item is active
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`!py-1 !px-2 hover:!bg-[#DBBFDB] ${
                        isActive && "bg-[#DBBFDB]"
                      } group is-published`}
                      asChild
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2 group/span"
                      >
                        <span
                          className={`text-[#DBBFDB] group-hover/span:text-[#4E144E] ${
                            isActive && "!text-[#4E144E]"
                          }`}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
