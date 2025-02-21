import { MdMailOutline } from "react-icons/md";
// import { LuUsers } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import Button from "./Button";
import { useState, useCallback, useEffect } from "react";
import EditorComponent from "./RichText/editor";
import apiClient from "@/services/apiClient";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import FilePickerModal from "./FilePickerModal";
import { DocumentObject, EmailRecipient, Interventions, User } from "@/common/interfaces";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "./DropdownMenu";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import { updateIssueReasonsDetailJobs } from "@/common/helpers";
import { LuUsers } from "react-icons/lu";

interface EditEmailProps {
  onSave: (body: string) => void;
  onCancel: () => void;
  issueId: number | null;
  isAddForm: boolean;
  emailTitle: string;
}

const EmailEditor: React.FC<EditEmailProps> = ({
  onCancel,
  onSave,
  issueId,
  isAddForm,
  // emailTitle,
}) => {
  const { issueReasonsDetail, setIssueReasonsDetail, organizationId } = useIssueReasonsStore();
  const ORGANIZATION_ID = organizationId;
  // const [isOpenRecipientsDropDown, setIsOpenRecipientsDropDown] =
  //   useState(false);
  //   const [isToOpenRecipientsDropDown, setIsToOpenRecipientsDropDown] =
  //   useState(false);
  const [content, setContent] = useState("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [attachments, setAttachments] = useState<DocumentObject[]>([]);
  const [ccRecipients, setCCRecipients] = useState<EmailRecipient[]>([]);
  const [toRecipients, setToRecipients] = useState<EmailRecipient[]>([]);
  // const [ccRecipientsOnChange, setCCRecipientsOnChange] = useState<string>();
  const [users] = useState<User[]>(issueReasonsDetail?.request?.users || []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputValueForToRecipients, setInputValueForToRecipients] = useState("");
  const [filteredUsersForToRecipients, setFilteredUsersForToRecipients] = useState<User[]>([]);
  const [inputValueForCCRecipients, setInputValueForCCRecipients] = useState("");
  const [filteredUsersForCCRecipients, setFilteredUsersForCCRecipients] = useState<User[]>([]);

 

  useEffect(() => {
    if (issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.from_.address) {
      setToRecipients((prev) => {
        if (!prev.some((r) => r.address === issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.from_.address)) {
          return [
            ...prev,
            {
              address: issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.from_.address,
              name: issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.from_.name,
            },
          ];
        }
        return prev;
      });
    }
  
  
    if (issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.cc.length) {
      setCCRecipients((prev) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        
        if (!prev.some((r) => r.address === issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.cc.length)) {
          return [
            ...prev,
            {    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-expect-error
              address: issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.cc.address,
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
              name: issueReasonsDetail?.request?.context?.email_chain?.chain[0]?.cc.name,
            },
          ];
        }
        return prev;
      });
    }
  
 
    return () => {
      setToRecipients([]);
      setCCRecipients([]);
    };
  
  }, [issueReasonsDetail?.request?.context?.email_chain?.chain]);
  

  // const toggleRecipientsDropDown = () =>
  //   setIsOpenRecipientsDropDown(!isOpenRecipientsDropDown);

  // const toggleToRecipientsDropDown = () =>
  //   setIsToOpenRecipientsDropDown(!isToOpenRecipientsDropDown);


  const handleFilePickerSubmit = (data: DocumentObject[]) => {
    setAttachments(data);
    setIsModalOpen(false);
  };
  const handleFilePickerClose = () => {
    setIsModalOpen(false);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setEmailBody(newContent.replace(/<[^>]+>/g, ""));
  };

  // const handleCCRecipientChange = (value: string) => {
  //   setCCRecipientsOnChange(value);
  //   console.log("helloo",ccRecipients)
  // };


  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setAttachments([...attachments, ...Array.from(e.target.files)]);
  //   }
  // };

  // const handleRemoveFile = (index: number) => {
  //   setAttachments(attachments.filter((_, i) => i !== index));
  // };

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return;

  //   const files = Array.from(e.target.files);
  //   const formData = new FormData();

  //   formData.append("description", "File(s) uploaded via EmailEditor");

  //   files.forEach((file) => {
  //     formData.append("files", file); // 'files' is the key expected by the API
  //   });
  //   // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGFzZWxhYnMiLCJzdWIiOiIyMjAiLCJleHAiOjE3MzY1MTk4ODMsImlhdCI6MTczNjQzMzQ4MywianRpIjoiZjNmNDcxMDhlZTI0NDgyZjllZGIyMjVkODFiMDRiN2MiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiY29udGV4dCI6eyJ1c2VyX2lkIjoyMjAsImlzX3N1cGVydXNlciI6ZmFsc2UsIm9yZ2FuaXNhdGlvbnMiOlt7InJvbGUiOiJhZG1pbiIsIm9yZ2FuaXNhdGlvbl9pZCI6NDN9XX19._CkcenMJ_wfI6sXznxH-eR-rbDZorXMC98MLCcnUDPw";
  //   try {
  //     const response = await apiClient.post(
  //       `/organisations/${ORGANIZATION_ID}/documents/upload`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           // Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success("File(s) uploaded successfully!");
  //       const documentId = response.data.documentId;
  //       setDocumentId(documentId);
  //       // const newAttachments = files.map((file) => ({
  //       //   file,
  //       // }));
  //       const newAttachments = files; //
  //       setAttachments((prev) => [...prev, ...newAttachments]);
  //     }
  //   } catch (error) {
  //     const contextualError = error as ContextualError;
  //     try {
  //       handleApiError(contextualError);
  //     } catch (handledError) {
  //       if (handledError instanceof Error) {
  //         showErrorToast(
  //           `Error in ${contextualError.context || "Unknown"}: ${
  //             handledError.message
  //           }`
  //         );
  //       } else {
  //         showErrorToast("An unexpected error occurred.");
  //       }
  //     }
  //   }
  // };

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

  //     if (e.target.files && documentId) {
  //       setAttachments([...attachments, ...Array.from(e.target.files)]);
  //     }
  //   };

  // const removeFile = async (documentId: string) => {
  //   try {
  //     const response = await apiClient.delete(
  //       `/organisations/${ORGANIZATION_ID}/documents/${documentId}`
  //     );
  //     if (response.status === 200) {
  //       showSuccessToast("Attachment removed");
  //     } else {
  //       showErrorToast("Failed to remove attachment");
  //     }
  //   } catch (error) {
  //     showErrorToast("Error removing attachment");
  //     console.error("Remove error:", error);
  //   }
  // };

  const handleRemoveFile = async (index: number) => {
    // const documentId = attachments[index]['documentId'];
    // if (documentId) {
    // await removeFile(index + "");
    // }

    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = useCallback(async () => {
    if (!emailBody.trim()) {
      showErrorToast("Email body is required!");
      return;

    }
    onSave(JSON.stringify(emailBody));




    const payload = {
      attachments: attachments.map((attachment) => ({ id: attachment.id })),
      cc: ccRecipients,
      email_body: {
        html: content,
        text: emailBody,
      },
      to: toRecipients,
    };

    try {
      const response = await apiClient.post(
        `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/create/send-email-job`,
        payload
      );

      if (response.status === 200) {
        const updatedData = updateIssueReasonsDetailJobs(issueReasonsDetail, response.data) as Interventions;
        setIssueReasonsDetail(updatedData);
        showSuccessToast("Email job created successfully!");
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        showErrorToast(handledError instanceof Error ? `Error in ${contextualError.context || "Unknown"}: ${handledError.message}` : "An unexpected error occurred.");
      }
    }
  }, [attachments, ccRecipients, content, emailBody, onSave, issueId, issueReasonsDetail, setIssueReasonsDetail, ORGANIZATION_ID, toRecipients]);

  const handleCancel = () => {
    if (onCancel) onCancel();
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValueForToRecipients(value);

    if (value) {
      setFilteredUsersForToRecipients(users.filter(user =>
      (`${user.first_name} ${user.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()))
      ));
    } else {
      setFilteredUsersForToRecipients([]);
    }
  };

  const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValueForCCRecipients(value);
    if (value) {
      setFilteredUsersForCCRecipients(users.filter(user =>
      (`${user.first_name} ${user.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()))
      ));
    } else {
      setFilteredUsersForCCRecipients([]);
    }
  };

  const handleSelectRecipient = (recipient: User) => {
    if (!toRecipients.some(r => r.address === recipient.email)) {
      setToRecipients([...toRecipients, { address: recipient.email, name: `${recipient.first_name} ${recipient.last_name}` }]);
    }
    setInputValueForToRecipients("");
    setFilteredUsersForToRecipients([]);
  };

  const handleSelectRecipient1 = (recipient: User) => {
    if (!ccRecipients.some(r => r.address === recipient.email)) {
      setCCRecipients([...ccRecipients, { address: recipient.email, name: `${recipient.first_name} ${recipient.last_name}` }]);
    }
    setInputValueForCCRecipients("");
    setFilteredUsersForCCRecipients([]);
  };

  const handleAddManualEntry = () => {
    if (inputValueForToRecipients.trim() && !toRecipients.some(r => r.address === inputValueForToRecipients.trim())) {
      setToRecipients([...toRecipients, { address: inputValueForToRecipients.trim(), name: inputValueForToRecipients.trim() }]);
    }
    setInputValueForToRecipients("");
    setFilteredUsersForToRecipients([]);
  };


  const handleAddManualEntry1 = () => {
    if (inputValueForCCRecipients.trim() && !ccRecipients.some(r => r.address === inputValueForCCRecipients.trim())) {
      setCCRecipients([...ccRecipients, { address: inputValueForCCRecipients.trim(), name: inputValueForCCRecipients.trim() }]);
    }
    setInputValueForCCRecipients("");
    setFilteredUsersForCCRecipients([]);
  };



  return (
    <div className="rounded-lg w-full mx-auto h-auto p-2 sm:p-4 lg:p-4">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-[#512652] text-sm font-semibold">
          <MdMailOutline className="h-5 w-5 text-[#8C268C]" />
          {isAddForm ? "Create" : "Edit"} Email Job
        </h2>
        <p className="text-[#858B9B] text-xs m-1">
          {isAddForm
            ? "Set a date for the AI SDR to follow up."
            : "The email that the AI SDR will share with the contact."}
        </p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-600">Email Body</label>
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
          />
        </div>
      </div>
      {/* <div className="mb-6">
      <label className="block mb-2 text-sm text-gray-600">To Recipients</label>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-md p-2 min-h-[48px] w-full sm:flex-grow sm:w-auto">
          {toRecipients.map((recipient, index) => (
            <div key={index} className="flex items-center bg-[#F8E9F8] px-2 py-0.5 rounded min-w-fit">
              <span className="text-[#8C268C] text-xs whitespace-nowrap">{recipient.address}</span>
              <button
                onClick={() => setToRecipients(toRecipients.filter((_, i) => i !== index))}
                className="ml-1 text-gray-800"
              >
                <RxCross2 className="w-2.5 h-2.5 text-[#8c268c]" />
              </button>
            </div>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={toggleToRecipientsDropDown}>
            <div className="w-[48px] h-[48px] flex justify-center items-center border-2 border-gray-100 rounded-md">
              <LuUsers className="w-4 h-4 text-[#8C268C]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent isOpen={isToOpenRecipientsDropDown} onClose={() => setIsToOpenRecipientsDropDown(false)}>
            {users.length > 0 ? (
              users.map((user) => {
                const isSelected = toRecipients.some((recipient) => recipient.address === user.email)
                return (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => {
                      if (!isSelected) {
                        setToRecipients((prev) => [
                          ...prev,
                          {
                            address: user.email,
                            name: `${user.first_name} ${user.last_name}`,
                          },
                        ])
                      }
                    }}
                    // className={isSelected ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {user.first_name} {user.last_name}
                  </DropdownMenuItem>
                )
              })
            ) : (
              <DropdownMenuItem>No users available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div> */}
    <div className="mb-6">
  <label className="block mb-2 text-sm text-gray-600">To Recipients</label>
  <div className="flex items-center gap-2">
    <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-md p-2 min-h-[48px] flex-grow">
      {toRecipients.map((recipient, index) => (
        <div key={index} className="flex items-center bg-[#F8E9F8] px-2 py-0.5 rounded min-w-fit">
          <span className="text-[#8C268C] text-xs whitespace-nowrap">{recipient.address}</span>
          <button onClick={() => setToRecipients(toRecipients.filter((_, i) => i !== index))} className="ml-1">
            <RxCross2 className="w-2.5 h-2.5 text-[#8C268C]" />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValueForToRecipients}
        onChange={(e) => handleInputChange(e)}
        onKeyDown={(e) => e.key === "Enter" && handleAddManualEntry()}
        className="outline-none flex-grow min-w-[150px] text-sm"
     
      />
    </div>
    <button className="w-[48px] h-[48px] flex justify-center items-center border-2 border-gray-100 rounded-md">
      <LuUsers className="w-4 h-4 text-[#8C268C]" />
    </button>
  </div>
  {filteredUsersForToRecipients.length > 0 && (
    <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-md max-h-40 overflow-auto w-full">
      {filteredUsersForToRecipients.map((user) => (
        <div
          key={user.id}
          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
          onClick={() => handleSelectRecipient(user)}
        >
          {user.first_name} {user.last_name}
        </div>
      ))}
    </div>
  )}
</div>


      {/* <div className="mb-6">
      <label className="block mb-2 text-sm text-gray-600">CC Recipients (Optional)</label>
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-md p-2 min-h-[48px] w-full sm:flex-grow sm:w-auto">
          {ccRecipients.map((recipient, index) => (
            <div key={index} className="flex items-center bg-[#F8E9F8] px-2 py-0.5 rounded min-w-fit">
              <span className="text-[#8C268C] text-xs whitespace-nowrap">{recipient.address}</span>
              <button
                onClick={() => setCCRecipients(ccRecipients.filter((_, i) => i !== index))}
                className="ml-1 text-gray-800"
              >
                <RxCross2 className="w-2.5 h-2.5 text-[#8c268c]" />
              </button>
            </div>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={toggleRecipientsDropDown}>
            <div className="w-[48px] h-[48px] flex justify-center items-center border-2 border-gray-100 rounded-md">
              <LuUsers className="w-4 h-4 text-[#8C268C]" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent isOpen={isOpenRecipientsDropDown} onClose={() => setIsOpenRecipientsDropDown(false)}>
            {users.length > 0 ? (
              users.map((user) => {
                const isSelected = ccRecipients.some((recipient) => recipient.address === user.email)
                return (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => {
                      if (!isSelected) {
                        setCCRecipients((prev) => [
                          ...prev,
                          {
                            address: user.email,
                            name: `${user.first_name} ${user.last_name}`,
                          },
                        ])
                      }
                    }}
                    // className={isSelected ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {user.first_name} {user.last_name}
                  </DropdownMenuItem>
                )
              })
            ) : (
              <DropdownMenuItem>No users available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div> */}


<div className="mb-6">
  <label className="block mb-2 text-sm text-gray-600">CC Recipients (Optional)</label>
  <div className="flex items-center gap-2">
    <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-md p-2 min-h-[48px] flex-grow">
      {ccRecipients.map((recipient, index) => (
        <div key={index} className="flex items-center bg-[#F8E9F8] px-2 py-0.5 rounded min-w-fit">
          <span className="text-[#8C268C] text-xs whitespace-nowrap">{recipient.address}</span>
          <button onClick={() => setCCRecipients(ccRecipients.filter((_, i) => i !== index))} className="ml-1">
            <RxCross2 className="w-2.5 h-2.5 text-[#8C268C] "  />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValueForCCRecipients}
        onChange={handleInputChange1}
        onKeyDown={(e) => e.key === "Enter" && handleAddManualEntry1()}
        className="outline-none flex-grow min-w-[150px] text-sm"
       
      />
    </div>
    <button className="w-[48px] h-[48px] flex justify-center items-center  border-2 border-gray-100 rounded-md">
      <LuUsers className="w-4 h-4 text-[#8C268C] " />
    </button>
  </div>
  {filteredUsersForCCRecipients.length > 0 && (
    <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-md max-h-40 overflow-auto w-full">
      {filteredUsersForCCRecipients.map((user) => (
        <div
          key={user.id}
          className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
          onClick={() => handleSelectRecipient1(user)}
        >
          {user.first_name} {user.last_name}
        </div>
      ))}
    </div>
  )}
</div>





      <div className="mb-6">
        <div className="flex justify-between">
          <label className="block mb-2 text-sm text-gray-600">
            Attachments
          </label>
          <div className="flex justify-between items-center mb-4">
            <div className="flex" onClick={() => setIsModalOpen(true)}>
              {/* <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              /> */}
              <label
                htmlFor="file-upload"
                className="bg-gray-200 rounded text-center px-4 py-2 cursor-pointer text-xs text-gray-800"
              >
                Browse Files
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center bg-[#F8E9F8] px-3 py-1 rounded min-w-fit"
            >
              <span className="text-[#8C268C] text-sm whitespace-nowrap">
                {file.filename}
              </span>
              <button
                onClick={() => handleRemoveFile(index)}
                className="ml-2 text-gray-800"
              >
                <RxCross2 className="w-3 h-3 text-[#8c268c]" />
              </button>
            </div>
          ))}
        </div>

      </div>

      <div className="flex flex-col md:flex-row justify-between gap-3 pt-5">
        <Button
          color="Gray"
          text="Cancel"
          onClick={handleCancel}
          classes="h-12 w-full md:w-1/2 bg-[#F8E9F8] text-[#8C268C] text-sm"
        />
        <Button
          color="DarkPink"
          text="Save Changes"
          onClick={handleSave}
          classes="h-12 w-full md:w-1/2 text-sm text-white"
        />
      </div>
      {isModalOpen && (
        <FilePickerModal
          isOpen={isModalOpen}
          onSend={handleFilePickerSubmit}
          onClose={handleFilePickerClose}
        />
      )}
    </div>
  );
};

export default EmailEditor;
