import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarData } from "@/app/nextapi/avatars/models";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface AvatarSelectionDropdownProps {
  avatars: AvatarData[];
  isOpen: boolean;
  onSelect: (avatar: AvatarData) => void;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  isLoading?: boolean;
}

export function AvatarSelectionDropdown({
  avatars,
  isOpen,
  onSelect,
  onOpenChange,
  trigger,
  isLoading = false,
}: AvatarSelectionDropdownProps) {
  return (
    <DropdownMenu.Root
      open={isOpen && !isLoading}
      onOpenChange={onOpenChange}
      modal={true}
    >
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white rounded-lg shadow-lg p-2 w-[280px] border border-b-grey-2 dark:bg-b-black-1 dark:border-[var(--dark-border-color)]"
          sideOffset={5}
          align="end"
        >
          <div className="py-2 px-3">
            <h3 className="text-sm font-semibold text-b-black-1 mb-2 dark:text-white">
              Start a conversation with
            </h3>
          </div>

          {isLoading ? (
            <div className="py-3 px-3 text-sm text-b-grey-4 flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-b-purple-1" />
            </div>
          ) : avatars.length === 0 ? (
            <div className="py-3 px-3 text-sm text-b-grey-4 dark:text-white">
              No avatars available
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              {avatars.map((avatar) => (
                <DropdownMenu.Item
                  key={avatar.id}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-b-grey-1 dark:hover:bg-b-purple-5 outline-none rounded-lg dark:border-[var(--dark-border-color)]"
                  onSelect={() => onSelect(avatar)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={avatar.thumbnail || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback>
                      {avatar.characterCard.data.name?.[0] || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-b-black-1 dark:text-white">
                      {avatar.characterCard.data.name}
                    </p>
                    <p className="text-xs text-b-grey-4 dark:text-b-grey-0">
                      {avatar.characterCard.data.description}
                    </p>
                  </div>
                </DropdownMenu.Item>
              ))}
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
