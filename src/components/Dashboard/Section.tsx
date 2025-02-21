import { CreateButton } from "@/components/Dashboard/CreateButton";
import { useTheme } from "next-themes";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  createButtonText?: string;
  createButtonHref?: string;
  customCreateButton?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = "",
  icon,
  createButtonText,
  createButtonHref,
  customCreateButton,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`rounded-2xl p-4 md:p-8 border ${
        resolvedTheme === "dark"
          ? "bg-b-black-1 border-b-grey-3 text-white !border-[var(--dark-border-color)]"
          : "bg-[rgb(var(--background-secondary-rgb-light))] border-b-grey-2 text-b-black-1"
      } ${className}`}
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center">
          {icon}
          <span className="text-xl md:text-2xl font-semibold font-montserrat tracking-spaced">
            {title}
          </span>
        </div>
        {customCreateButton ||
          (createButtonText && createButtonHref && (
            <CreateButton btnText={createButtonText} href={createButtonHref} />
          ))}
      </div>
      {children}
    </div>
  );
};
