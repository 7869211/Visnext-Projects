import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Paperclip, Plus, Mail } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import Input from "./Input";
import { LuUsers } from "react-icons/lu";
import EditorComponent from "./RichText/editor";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import apiClient from "@/services/apiClient";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import { updateIssueReasonsDetailJobs } from "@/common/helpers";
import { Interventions } from "@/common/interfaces";

const ModalDemo = ({ issueId }: { issueId: number }) => {
  const { organizationId } = useIssueReasonsStore();
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("Email");
  const [content, setContent] = useState("");
  const [emailBody, setEmailBody] = useState<string>("");
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [ccRecipients, setCCRecipients] = useState<string[]>([]);
  const { issueReasonsDetail, setIssueReasonsDetail } = useIssueReasonsStore();
  const handleCCRecipientChange = () => {
    const updatedCC = [...ccRecipients];
    // updatedCC[index] = value;
    setCCRecipients(updatedCC);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setEmailBody(newContent.replace(/<[^>]+>/g, "")); // Strip HTML for plain text
  };

  const handleSave = async () => {
    if (!emailBody.trim()) {
      showErrorToast("Email body is required!");
      return;
    }

    try {
      const payload = {
        attachments: attachments.map((_, index) => ({
          id: index + 1,
        })),
        cc: ccRecipients
          .filter((email) => email.trim())
          .map((email) => ({
            address: email,
            name: "CC Name Placeholder",
          })),
        email_body: {
          html: content,
          text: emailBody,
        },
        to: [
        ],
      };

      const response = await apiClient.post(
        `/organisations/${organizationId}/interventions/${issueId}/create/send-email-job`,
        payload
      );

      if (response.status === 200) {
       const updatedData = updateIssueReasonsDetailJobs(issueReasonsDetail, response.data) as Interventions;;
      
        setIssueReasonsDetail(updatedData);
        showSuccessToast("Email job created successfully!");
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(
            `Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`
          );
        } else {
          showErrorToast("An unexpected error occurred.");
          console.log("An unexpected error occurred");
        }
      }
    }
  };


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const formData = new FormData();

    formData.append("description", "File(s) uploaded via EmailEditor");

    files.forEach((file) => {
      formData.append("files", file); // 'files' is the key expected by the API
    });
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGFzZWxhYnMiLCJzdWIiOiIyMjAiLCJleHAiOjE3MzY1MTk4ODMsImlhdCI6MTczNjQzMzQ4MywianRpIjoiZjNmNDcxMDhlZTI0NDgyZjllZGIyMjVkODFiMDRiN2MiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiY29udGV4dCI6eyJ1c2VyX2lkIjoyMjAsImlzX3N1cGVydXNlciI6ZmFsc2UsIm9yZ2FuaXNhdGlvbnMiOlt7InJvbGUiOiJhZG1pbiIsIm9yZ2FuaXNhdGlvbl9pZCI6NDN9XX19._CkcenMJ_wfI6sXznxH-eR-rbDZorXMC98MLCcnUDPw";
    try {
      const response = await apiClient.post(
        `/organisations/${organizationId}/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showSuccessToast("File(s) uploaded successfully!");
        // const documentId = response.data.documentId;
        // const newAttachments = files.map((file) => ({
        //   file,
        // }));
        const newAttachments = files; //
        setAttachments((prev) => [...prev, ...newAttachments]);
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(
            `Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`
          );
        } else {
          showErrorToast("An unexpected error occurred.");
        }
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragover = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          color="Pink"
          icon={<FaPlus />}
          text="Add Job"
          classes="text-[#8C268C] text-xs rounded-tl rounded-bl rounded-tr rounded-br"
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-w-[40vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none h-[90vh] overflow-auto">
          <Dialog.Title className="flex items-center text-xl font-semibold text-gray-800">
            <div className="flex justify-center items-center border rounded w-12 h-12 mr-4">
              <Plus className=" w-6 h-6 text-gray-500 " />
            </div>
            Add New Job
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mt-1 ml-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore.
          </Dialog.Description>
          <div className="flex justify-around w-full bg-gray-100 rounded-lg p-1 gap-16 mt-2">
            <button
              onClick={() => setActiveTab("Email")}
              className={`w-1/3 text-center py-2 rounded-md ${
                activeTab === "Email"
                  ? "bg-white text-purple-700 shadow"
                  : "text-gray-600"
              } transition-all duration-300`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab("Meeting")}
              className={`w-1/3 text-center py-2 rounded-md ${
                activeTab === "Meeting"
                  ? "bg-white text-purple-700 shadow"
                  : "text-gray-600"
              } transition-all duration-300`}
            >
              Meeting
            </button>
            <button
              onClick={() => setActiveTab("Referral")}
              className={`w-1/3 text-center py-2 rounded-md ${
                activeTab === "Referral"
                  ? "bg-white text-purple-700 shadow"
                  : "text-gray-600"
              } transition-all duration-300`}
            >
              Referral
            </button>
          </div>

          {activeTab === "Email" && (
            <div className="border rounded-lg mt-4">
              <div className="flex gap-3 mt-4 ml-4">
                <Mail className="text-gray-500" />
                <h3 className="text-gray-800">Create Email Job</h3>
              </div>
              <div className="mt-4 mx-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Body
                </label>
                <div className="border-2 border-gray-100 rounded overflow-hidden h-[230px]">
                  <EditorComponent
                    content={content}
                    onChange={handleContentChange}
                    editorFeaturesFlages={{
                      bold: true,
                      italic: true,
                      unOrderedList: true,
                      link: true,
                      alignLeft: true,
                      alignCenter: true,
                      orderedList: true,
                      underline: true,
                      undo: true,
                      redo: true,
                    }}
                    classes="h-full w-full"
                  />
                </div>
              </div>

              <div className="mt-4 mx-4">
                <label className="block text-sm font-medium text-gray-700">
                  CC Recipients (Optional)
                </label>
                <div className="flex flex-wrap gap-1">
                  <Input
                    type="text"
                    placeholder="Enter Email address recipients"
                    onChange={() => handleCCRecipientChange()}
                    customStyles="border-2 border-gray-100 h-[48px] w-full sm:flex-grow sm:w-auto"
                  />
                  <div className="h-[48px] w-[48px] min-w-[48px] border-2 border-gray-100 rounded flex justify-center items-center md:h-[57px]">
                    <LuUsers className="text-[#8C268C] w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="my-4 mx-4">
                <div className="text-sm font-medium text-gray-700">
                  Attachment
                </div>
                <div
                  className="mt-2 flex flex-col items-center justify-center border-3 border border-gray-300 rounded-sm p-6 text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragover}
                  onClick={triggerFileInput}
                >
                  <div
                    className="mb-4 w-16 h-16 bg-blue-200 border rounded-full"
                    onClick={triggerFileInput}
                  >
                    <Paperclip className="w-8 h-8 text-blue-500 cursor-pointer translate-x-4 translate-y-3" />
                  </div>
                  <div className="text-[#A732A7] font-semibold cursor-pointer hover:text-purple-700">
                    Add Attachments
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Drag & drop files here or click to browse
                  </div>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected file: <strong>{file.name}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "Meeting" && (
            <div className="p-4 text-black bg-white rounded-lg shadow">
              This is the Meeting tab content.
            </div>
          )}
          {activeTab === "Referral" && (
            <div className="p-4 text-black bg-white rounded-lg shadow">
              This is the Referral tab content.
            </div>
          )}
          <div className="mt-6 flex justify-between gap-3">
            <Dialog.Close asChild>
              <button className="w-[350px] px-4 py-2 text-sm text-gray-700 rounded border border-gray-300 hover:bg-gray-100">
                Cancel
              </button>
            </Dialog.Close>

            <button className="w-[350px] px-4 py-2 text-sm text-white rounded bg-[#A732A7] hover:bg-[#701B70]  text-lg focus:ring-1 focus:ring-offset-1 hover:outline-[#DC9BDC] focus:ring-[#DC9BDC]"  onClick={handleSave}>
              Create Job
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-6 right-3 rounded-full p-1 hover:bg-gray-100 focus:outline-none "
              aria-label="Close"
            >
              <Cross2Icon className="w-6 h-6 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalDemo;
