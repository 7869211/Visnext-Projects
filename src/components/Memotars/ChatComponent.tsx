"use client";

import { User, Paperclip, Smile, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AvatarConversationMessageData } from "../../app/nextapi/conversations/models";
import { useUploadFile } from "@/app/nextapi/files/api";
import { v4 as uuid } from "uuid";
import { UploadedFile } from "@/components/conversation-file-upload";

interface ChatComponentProps {
  messages: AvatarConversationMessageData[];
  onSendMessage: (message: string, fileIds: string[]) => Promise<void>;
  isLoading: boolean;
  avatarId: string;
  conversationId: string;
  className?: string;
}

export default function ChatComponent({
  messages,
  onSendMessage,
  isLoading,
  avatarId,
  conversationId,
  className = "",
}: ChatComponentProps) {
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([]);

  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: uploadFile } = useUploadFile({
    onSuccess: (data, variables) => {
      setUploadingFiles((prev) =>
        prev.map((file) =>
          file.id === variables.file.id
            ? { ...file, fileId: data.upload!.fileId!, progress: 100 }
            : file
        )
      );
    },
    onError: (error) => {
      console.error("File upload error:", error);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const id = uuid();
      setUploadingFiles((prev) => [...prev, { id, file, progress: 0 }]);

      uploadFile({
        avatarId,
        usage: "conversationAttachment",
        reference: { conversationId },
        file: { id, file },
        onUploadProgress: (file, progress) => {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === file.id ? { ...f, progress: progress?.progress || 0 } : f
            )
          );
        },
      });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputText((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && uploadingFiles.length === 0) || isSending) return;

    try {
      setIsSending(true);
      const fileIds = uploadingFiles
        .filter((file) => file.fileId)
        .map((file) => file.fileId!);
      setInputText("");
      await onSendMessage(inputText, fileIds);
      setUploadingFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full relative">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-b-purple-1"></div>
        </div>
      ) : (
        <>
          {/* Chat Messages Container */}
          <div className="flex-1 overflow-auto pb-[120px] md:pb-[100px] bg-b-grey-0 dark:bg-b-black-2">
            <div className="max-w-3xl mx-auto w-full px-4 py-4">
              {messages
                .filter((message) => message.messageType.label !== "system")
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 mb-4${
                      message.messageType.label === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        message.messageType.label === "assistant"
                          ? ""
                          : "order-last"
                      }`}
                    >
                      <div className="bg-b-grey-2 rounded-full p-2 dark:bg-white">
                        <User className="text-b-purple-1" size={16} />
                      </div>
                    </div>
                    <div
                      className={`max-w-[80%] bg-white p-4 border border-b-grey-2 dark:bg-b-black-1 dark:border-[var(--dark-border-color)] ${
                        message.messageType.label === "assistant"
                          ? "rounded-r-xl rounded-bl-xl"
                          : "rounded-l-xl rounded-br-xl"
                      }`}
                    >
                      <p className="text-b-black-1 text-base dark:text-white">
                        {message.items
                          .filter((item) => item.$type === "text")
                          .map((item) => item.content)
                          .join(" ")}
                      </p>

                      {message.items.filter((item) => item.$type === "file")
                        .length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.items
                            .filter((item) => item.$type === "file")
                            .map((item) => {
                              const fileName =
                                item.path?.split("_").pop() || "File";
                              return (
                                <div
                                  key={item.path}
                                  className="bg-b-grey-1 rounded-lg px-2 py-1 text-xs text-b-black-1 mt-1"
                                >
                                  {fileName}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} className="h-[20px]" />
            </div>
          </div>

          {/* Floating Chat Input */}
          <div className="absolute bottom-0 inset-x-0 z-10 pb-[20px] md:pb-0">
            <div className="bg-b-grey-0 py-4 dark:bg-b-black-2">
              <div className="max-w-3xl mx-auto px-4 ">
                <div className="rounded-lg bg-white shadow-lg dark:bg-b-black-2">
                  {/* File preview inside input */}
                  {uploadingFiles.length > 0 && (
                    <div
                      className="px-3 pt-2 flex flex-wrap gap-2 border-b border-b-grey-2 
                    dark:bg-b-black-2 dark:border-none"
                    >
                      {uploadingFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center bg-b-grey-1 rounded-lg px-2 py-1 text-xs mb-2 dark:bg-b-purple-5"
                        >
                          <span className="text-b-black-1 dark:text-white">
                            {file.file.name} - {file.progress}%
                          </span>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="ml-2 text-b-grey-3 hover:text-b-purple-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input area */}
                  <div className="flex items-center gap-2 p-3 dark:bg-b-black-1 dark:border-[var(--dark-border-color)] dark:border-3 rounded-lg">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type here..."
                      className="flex-1 outline-none text-base resize-none min-h-[40px] max-h-[80px] overflow-y-auto
                       dark:bg-b-black-1 dark:text-white dark:text-b-grey-3 dark:placeholder-b-grey-3"
                      rows={1}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex items-center gap-1">
                      <div className="relative" ref={emojiPickerRef}>
                        <button
                          className="p-2 text-b-grey-5 hover:text-b-purple-1"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile size={20} className="dark:text-white" />
                        </button>
                        {showEmojiPicker && (
                          <div className="absolute bottom-12 right-0 z-10">
                            <Picker
                              data={data}
                              onEmojiSelect={handleEmojiSelect}
                              theme="light"
                              previewPosition="none"
                              skinTonePosition="none"
                            />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".jpg,.jpeg,.png,.txt"
                        multiple
                      />
                      <button
                        className="p-2 text-b-grey-5 hover:text-b-purple-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={20} className="dark:text-white" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={isSending}
                      className={`bg-b-purple-1 text-white px-4 py-2 rounded-lg opacity-50 text-sm font-medium ${className} ${
                        isSending
                          ? "opacity-50 cursor-not-allowed dark:text-black dark:bg-b-grey-6"
                          : ""
                      }`}
                    >
                      {isSending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
