import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

const NavLink: React.FC<{
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ href, icon, children }) => {
  const pathname = usePathname() ?? "";
  const isActive = pathname.startsWith(href);
  const { resolvedTheme } = useTheme();

  return (
    <Link
      href={href}
      className={`flex items-center text-base pl-4 py-4 font-montserrat tracking-spaced ${
        isActive
          ? resolvedTheme === "light"
            ? "bg-b-grey-1 font-semibold rounded-l-md"
            : "bg-b-purple-5 font-semibold rounded-l-md text-white"
          : !isActive && resolvedTheme === "dark"
          ? "text-white"
          : ""
      }`}
    >
      {icon}
      {children}
    </Link>
  );
};

export default NavLink;
