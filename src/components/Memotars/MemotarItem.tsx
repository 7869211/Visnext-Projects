import Image from "next/image";
import { getTimeString } from "@/lib/utils";
import { AvatarData } from "@/app/nextapi/avatars/models";

export const MemotarItem: React.FC<AvatarData> = ({
  characterCard,
  thumbnail,
  updatedAt,
}) => {
  return (
    <div className="flex items-center rounded-xl border border-b-grey-2 cursor-pointer h-[88px] overflow-hidden dark:border-[var(--dark-border-color)]">
      <div className="relative w-[88px] h-[88px] flex-shrink-0">
        <Image
          src={thumbnail ? thumbnail : "/placeholder-user.jpg"}
          alt={`${characterCard.data.name}'s avatar`}
          fill
          className="rounded-l-xl object-cover"
        />
      </div>

      <div className="flex flex-col h-full py-2 px-3 flex-grow min-w-0 justify-center">
        {" "}
        <div className="flex items-start justify-between w-full">
          <span className="text-base font-semibold text-b-black-1 tracking-spaced truncate dark:text-white">
            {characterCard.data.name}
          </span>
          <div className="flex flex-col items-end shrink-0 ml-2">
            <span className="text-xxs text-grey-300 italic tracking-spaced text-b-grey-3">
              Last active
            </span>
            <span className="text-xxs text-b-black-1 tracking-spaced dark:text-white">
              {getTimeString(updatedAt)}
            </span>
          </div>
        </div>
        <p className="text-b-grey-5 text-xs truncate tracking-spaced mt-1 dark:text-b-grey-0">
          {characterCard.data.description}
        </p>
      </div>
    </div>
  );
};
