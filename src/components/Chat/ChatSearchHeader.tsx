import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { AvatarSelectionDropdown } from "./AvatarSelectionDropdown";
import { AvatarData } from "@/app/nextapi/avatars/models";
import { useState, useCallback } from "react";

interface ChatSearchHeaderProps {
  className?: string;
  onSearch?: (query: string) => void;
  onSelectAvatar?: (avatar: AvatarData) => void;
  avatars: AvatarData[];
  isCreating?: boolean;
}

export function ChatSearchHeader({
  className = "",
  onSearch,
  onSelectAvatar,
  avatars,
  isCreating = false,
}: ChatSearchHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Memoize the handlers
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!isCreating && avatars.length > 0) {
        setIsDropdownOpen(open);
      }
    },
    [isCreating, avatars]
  );

  const handleAvatarSelect = useCallback(
    (avatar: AvatarData) => {
      onSelectAvatar?.(avatar);
      setIsDropdownOpen(false);
    },
    [onSelectAvatar]
  );

  return (
    <div className={`flex gap-2 p-4 dark:bg-b-purple-4 ${className}`}>
      <Input
        placeholder="Search"
        onChange={(e) => onSearch?.(e.target.value)}
        className="w-full border border-b-grey-2 font-montserrat tracking-spaced h-10 bg-transparent 
        dark:border-[var(--dark-border-color)] dark:text-b-grey-0 dark:bg-b-black-1 dark:placeholder-b-grey-0 "
        disabled={isCreating}
      />
      <AvatarSelectionDropdown
        avatars={avatars}
        isOpen={isDropdownOpen}
        onOpenChange={handleOpenChange}
        onSelect={handleAvatarSelect}
        isLoading={isCreating}
        trigger={
          <button
            className={`p-2 bg-b-purple-1 text-white rounded-lg h-10 w-10 flex items-center justify-center flex-shrink-0 dark:bg-b-purple-1 ${
              avatars.length > 0 && !isCreating
                ? "hover:bg-b-purple-3"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={isCreating || avatars.length === 0}
          >
            {isCreating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-white" />
            ) : (
              <PlusIcon className="h-5 w-5 dark:text-black" />
            )}
          </button>
        }
      />
    </div>
  );
}
