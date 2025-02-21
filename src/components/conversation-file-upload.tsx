import { useUploadFile } from "@/app/nextapi/files/api";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Dropzone from "react-dropzone";
import { v4 as uuid } from "uuid";

interface Props {
  avatarId: string;
  conversationId: string;
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export interface UploadedFile {
  id: string;
  file: File;
  fileId?: string;
  progress: number;
}

const ConversationFileUpload = forwardRef(
  ({ avatarId, conversationId, onFilesUploaded }: Props, ref) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    useEffect(() => {
      onFilesUploaded(uploadedFiles);
    }, [uploadedFiles, onFilesUploaded]);

    useImperativeHandle(ref, () => ({
      clearFiles() {
        setUploadedFiles([]);
      },
    }));

    const { mutate: uploadFile } = useUploadFile({
      onSuccess: (data, variables) => {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === variables.file.id
              ? { ...file, fileId: data.upload!.fileId!, progress: 100 }
              : file
          )
        );
      },
      onError: (error: any) => {
        console.error("File upload error", error);
      },
    });

    const handleDropAccepted = (acceptedFiles: File[]) => {
      acceptedFiles.forEach((acceptedFile) => {
        const id = uuid();
        setUploadedFiles((prev) => [
          ...prev,
          {
            id,
            file: acceptedFile,
            progress: 0,
          },
        ]);

        uploadFile({
          avatarId,
          usage: "conversationAttachment",
          reference: {
            conversationId,
          },
          file: {
            id,
            file: acceptedFile,
          },
          onUploadProgress: (file, progress) => {
            setUploadedFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, progress: progress?.progress || 0 }
                  : f
              )
            );
          },
        });
      });
    };

    const handleRemoveFile = (fileId: string) => {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    return (
      <div>
        <Dropzone
          accept={{
            "image/*": [".jpg", ".jpeg", ".png"],
            "text/*": [".txt"],
          }}
          onDropAccepted={handleDropAccepted}
          multiple={true}
          maxSize={50000000}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps({
                className: cn(
                  "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                ),
              })}
            >
              <div className="flex items-center gap-x-3 mt-2 mb-2">
                <label htmlFor="Files" tabIndex={0}>
                  Drag and drop documents here, or click to select.
                  <input {...getInputProps()} />
                </label>
              </div>
            </div>
          )}
        </Dropzone>
        <div className="mt-4">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between mb-2 p-2 border border-[#e2e8f0] rounded-md"
            >
              <span>
                {file.file.name} - {file.progress}%
              </span>
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveFile(file.id)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ConversationFileUpload.displayName = "ConversationFileUpload";

export default ConversationFileUpload;
