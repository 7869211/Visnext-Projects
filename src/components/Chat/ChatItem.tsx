import Image from "next/image";
import { Chat } from "@/types/chat.types";
import { getTimeString } from "@/lib/utils";

export const ChatItem: React.FC<Chat> = ({
  title,
  description,
  syncedContributionMessagesAt,
  thumbnail,
  className = "",
}) => {

  return (
    <div
      className={`rounded-lg pt-3 px-4 pb-4 md:p-3 border border-b-grey-2 cursor-pointer h-22
      dark:border-[var(--dark-border-color)] dark:bg-b-black-1 ${className}`} 
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center mb-2">
        <div className="relative w-6 h-6 flex-shrink-0">
          <Image
            src={thumbnail ? thumbnail : "/placeholder-user.jpg"}
            alt={`${title}'s chat`}
            fill
            className="rounded-full object-cover"
          />
        </div>

        <h3 className="font-semibold text-b-black-1 truncate text-base tracking-spaced dark:text-white">
          {title}
        </h3>

        <div className="flex flex-col items-end text-xxs">
          <span className="text-b-grey-3 italic tracking-spaced dark:text-b-grey-3">
            Last active
          </span>
          <span className="text-b-black-1 tracking-spaced dark:text-white">
            {getTimeString(syncedContributionMessagesAt)}
          </span>
        </div>
      </div>
      <p className="text-b-grey-5 italic text-xs md:text-sm truncate tracking-spaced dark:text-b-grey-0">
        {description}
      </p>
    </div>
  );
};
