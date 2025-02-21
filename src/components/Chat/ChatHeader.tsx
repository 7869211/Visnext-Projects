import { Phone, Video, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { errorToast, successToast } from "../ui/toast";
import { useTheme } from "next-themes";
import { useDeleteConversation } from "@/app/nextapi/conversations/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  name: string;
  avatarId?: string;
  conversationId?: string;
  className?: string;
}

export function ChatHeader({
  name,
  avatarId,
  conversationId,
  className = "",
}: ChatHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { mutate: deleteConversation } = useDeleteConversation({
    onSuccess: () => {
      successToast("Chat deleted successfully.", {}, resolvedTheme);
      setIsDialogOpen(false);
    },
    onError: (error) => {
      errorToast("Failed to delete the chat.", {}, resolvedTheme);
      setIsDialogOpen(false);
      console.error("Error deleting chat:", error.message);
    },
  });

  const handleDeleteChat = () => {
    if (avatarId && conversationId) {
      deleteConversation({ avatarId, conversationId });
    } else {
      errorToast("Avatar ID or Conversation ID is missing.", {}, resolvedTheme);
    }
  };

  const handleGoToProfile = () => {
    router.push(`/memotars/details?id=${avatarId}`);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between md:px-[300px] py-3 bg-white font-montserrat tracking-spaced ${className} dark:bg-[#000009] `}
      >
        <div className="flex items-center gap-3 ">
          <div className="w-10 h-10 rounded-full bg-b-grey-2 flex items-center justify-center overflow-hidden dark:bg-white">
            <span className="text-b-purple-1 text-base font-medium ">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-b-black-1 dark:text-white">
            {name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-b-grey-1 border border-b-grey-2 rounded-lg disabled dark:bg-b-black-1 dark:border-[#CEBEE7]">
            <Phone className="w-5 h-5 text-b-black-1 dark:text-white " />
          </button>
          <button className="p-2 hover:bg-b-grey-1 border border-b-grey-2 rounded-lg disabled dark:bg-b-black-1 dark:border-[#CEBEE7]">
            <Video className="w-5 h-5 text-b-black-1 dark:text-white" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-b-grey-1 rounded dark:bg-b-black-1">
                <MoreVertical className="w-5 h-5 text-b-black-1 dark:text-white" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="z-50  w-[131px] border-[#E0DAEA] bg-white shadow-lg">
              <DropdownMenuItem
                className="h-[48px] flex items-center justify-center hover:bg-b-grey-1 hover:cursor-pointer"
                onClick={handleGoToProfile}
              >
                Go to Profile
              </DropdownMenuItem>

              <div className="w-full border-t border-[#E0DAEA]" />

              <DropdownMenuItem
                className="h-[48px] flex items-center justify-center hover:cursor-pointer hover:bg-b-grey-1"
                onClick={() => setIsDialogOpen(true)}
              >
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[420px] max-h-[236px] border border-[#F4F2F7] bg-white">
            <DialogHeader>
              <DialogTitle className="my-2">Delete Chat?</DialogTitle>
              <DialogDescription className="text-base font-montserrat">
                Are you sure you want to delete this chat? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                className="px-4 py-2 bg-white text-[#3D2E5B] font-semibold border border-[#3D2E5B] rounded-lg hover:bg-b-grey-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#F34213] text-white font-semibold rounded-lg hover:bg-red-600"
                onClick={handleDeleteChat}
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
