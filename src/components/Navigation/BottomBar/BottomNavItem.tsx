import { usePathname } from "next/navigation";
import Link from "next/link";

interface BottomNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BottomNavItem: React.FC<BottomNavItemProps> = ({
  href,
  label,
  icon: Icon,
}) => {
  const pathname = usePathname() ?? "";
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center min-w-[72px] px-2 py-4 flex-1 ${
        isActive ? "bg-b-grey-1 dark:bg-b-purple-5" : ""
      }`}
    >
      <Icon className="w-4 h-4 text-b-black-1 dark:text-white" />
      <span
        className={`mt-2 text-xxs text-b-black-1 tracking-spaced font-montserrat dark:text-white ${
          isActive ? "font-bold" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  );
};
