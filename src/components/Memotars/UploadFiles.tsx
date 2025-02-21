"use client";

import { Upload, X } from "lucide-react";

interface UploadFilesProps {
  files: { id: string; name: string; url: string; file: File }[];
  setFiles: React.Dispatch<React.SetStateAction<{ id: string; name: string; url: string; file: File }[]>>;
}

const UploadFiles: React.FC<UploadFilesProps> = ({
  files,
  setFiles,
}) => {
  const acceptedFileTypes = ".jpg,.jpeg,.png,.webp,.tiff,.txt,.csv,.pdf";

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        file: file,
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      event.target.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prevFiles.filter((f) => f.id !== id);
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center">
        <label className="text-base text-b-black-1 font-normal tracking-spaced dark:text-white">
          Upload files (optional)
        </label>
      </div>
      <label className="cursor-pointer inline-block mt-3">
        <input
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileUpload}
          multiple
        />
        <span className="py-2 px-5 border border-b-purple-1 rounded-lg font-semibold text-base flex items-center text-b-purple-1
         tracking-expanded w-auto  dark:text-b-grey-6 dark:border-b-grey-6 dark:opacity-100">
          <Upload className="mr-2 dark:text-white dark:opacity-100" size={16} />
          Upload
        </span>
      </label>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center bg-b-grey-1 rounded-xl px-3 py-1 border border-b-grey-2 dark:bg-b-purple-5 dark:border-none"
            >
              <span className="text-sm text-b-black-1 dark:text-white">{file.name}</span>
              <button
                onClick={() => handleRemoveFile(file.id)}
                className="text-b-grey-3 cursor-pointer ml-2"
              >
                <X size={16} className="dark:text-white"/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadFiles;
