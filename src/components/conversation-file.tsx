import { AvatarConversationMessageFileContentData } from "@/app/nextapi/conversations/models";
import { useFetchFile } from "@/app/nextapi/files/api";
import Image from "next/image";

type Props = {
  avatarId: string;
  content: AvatarConversationMessageFileContentData;
};

export function ConversationFile({ avatarId, content }: Props) {
  const { data: remoteFile } = useFetchFile(avatarId, content.file.fileId);
  if (remoteFile?.mediaType === "image") {
    return (
      <div className="flex justify-end">
        <a
          href={remoteFile.url}
          target="_blank"
          rel="noopener noreferrer"
          title={remoteFile.originalName}
        >
          <Image
            src={remoteFile.url}
            alt={remoteFile.originalName}
            title={remoteFile.originalName}
            className="w-full max-w-40"
          />
        </a>
      </div>
    );
  }
  return <></>;
}
