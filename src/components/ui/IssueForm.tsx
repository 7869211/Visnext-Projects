import React, { useState } from "react";
import Input from "./Input";
import TextArea from "./TextArea";
import Button from "./Button";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import apiClient from "@/services/apiClient";
import { FaqObject, Interventions } from "@/common/interfaces";
import useIssueReasonsStore from "@/store/issueReasonsStore";

interface IssueFormProps {
  issueReasons: Interventions;
}

const IssueFormComponent: React.FC<IssueFormProps> = ({ issueReasons }) => {
  const { organizationId } = useIssueReasonsStore();
  const [files, setFiles] = useState<FileList>();
  // Single question state and error messages
  const [question, setQuestion] = useState<FaqObject>();

  const [errorMessages, setErrorMessages] = useState<{
    question?: string;
    directAnswer?: string;
    description?: string;
  }>({});

  const handleChange = (field: string, value: string | File | null) => {
  
    setErrorMessages((prev) => ({ ...prev, [field]: "" }));

    // Reset files if question or directAnswer is updated
    if ((field === "question" || field === "directAnswer") && files) {
      setFiles(undefined);
    }

    setQuestion((prev) => ({ ...prev, [field]: value }));
  };
const handleSubmit = async () => {
  let hasError = false;
  const newErrorMessages: {
    question?: string;
    directAnswer?: string;
    description?: string;
  } = {};

  const errors: {
    question?: string;
    directAnswer?: string;
    description?: string;
  } = {};

  if (question && !question.files && !question.question)
    errors.question = "This field is required.";
  if (question && !question.files && !question.directAnswer)
    errors.directAnswer = "This field is required.";
  if (question && question.files && !question.description)
    errors.description = "This field is required.";

  if (Object.keys(errors).length > 0) {
    hasError = true;
    newErrorMessages.question = errors.question;
    newErrorMessages.directAnswer = errors.directAnswer;
    newErrorMessages.description = errors.description;
  }

  if (hasError) {
    setErrorMessages(newErrorMessages);
    return;
  }

  try {
    const campaign_id = issueReasons?.request
      ? issueReasons?.request?.context.campaign_id
      : 0;
    const issue_id = issueReasons?.id;
    const exchange_id = issueReasons?.exchange_id;
    const description=question?.description;
    let response;
 
    if (question && question.files) {
      const formData = new FormData();  
  
      formData.append('description', description || '');
      formData.append('campaign_ids', JSON.stringify([campaign_id ? [campaign_id] : []]));
      Array.from(question.files).forEach((file) => {
        formData.append('files', file); 
      });
      response = await apiClient.post(
        `/organisations/${organizationId}/campaigns/documents/upload`,
        formData
      );
    } 
    
    else {

      const faqData = {
        faq: {
          question: question?.question,
          answer: question?.directAnswer,
        },
        campaign_ids: {
          ids: campaign_id ? [campaign_id] : [],
        },
        //add_to_all_campaigns: false,
      };
      response = await apiClient.post(
        `/organisations/${organizationId}/campaigns/faqs/create?add_to_all_campaigns=false`,
        faqData
      );
    }

    if (response.status === 200) {
      showSuccessToast("Item added successfully!");

      await apiClient.post(
        `/superuser/${exchange_id}/schedule-alga-request`,
        { follow_up: false }
      );
      showSuccessToast("Resent to AI successfully!");

      await apiClient.delete(
        `/organisations/${organizationId}/interventions/${issue_id}`
      );
      showSuccessToast("Issue deleted successfully!");
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


  const addFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setQuestion((prev) => ({ ...prev, files: e.target.files }));
  };

  // const handleFileUpload = async () => {
  //   if (question && !question.files) return;

  //   const description = question && question.description;
  //   if (!description) {
  //     showErrorToast("Please add a description for the file");
  //     return;
  //   }
  //   if (question && !question.files) return;
  //   const filesData =
  //   question.files ? Array.from(question.files) : [];
  //   const formData = new FormData();

  //   formData.append("description", description);

  //   filesData.forEach((file) => {
  //     formData.append("files", file); // 'files' is the key expected by the API
  //   });
  //   const campaign_id =issueReasons?.request ? issueReasons?.request?.context.campaign_id : 0;
  //   try {
  //     const response = await apiClient.post(
  //       `/organisations/${organizationId}/campaigns/${campaign_id}/documents/upload`,
  //       formData
  //     );

  //     if (response.status === 200) {
  //       showSuccessToast("File(s) uploaded successfully!");
  //       const documentId = response.data.documentId;
  //       const newAttachments: File[] = filesData as unknown as File[];
  //       setAttachments((prev) => [...prev, ...newAttachments]);
  //       console.log("Attachments", attachments, documentId);
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

  return (
    <form
      className="flex flex-col 
        scrollbar scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300
        w-full bg-white mx-auto p-2 md:p-4 lg:p-6 rounded max-h-[630px] overflow-y-auto"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Question */}
      <div className="flex-1 mb-6 border-b pb-3">
        <label className="block text-gray-600 text-sm mb-2">Question</label>
        <Input
          type="text"
          value={question && question.question}
          onChange={(value) => handleChange("question", value)}
          placeholder="Enter question"
          customStyles="w-full h-8 !border-[#CBD2E0] border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
        />
        {errorMessages.question && (
          <p className="text-red-500 text-sm mt-1">{errorMessages.question}</p>
        )}

        {/* Direct Answer */}
        <label className="block text-gray-600 text-sm mt-4 mb-2">
          Direct Answer
        </label>
        <TextArea
          placeholder="Type your answer here..."
          value={question && question.directAnswer}
          onChange={(value) => handleChange("directAnswer", value)}
          classes="!border-[#CBD2E0]"
        />
        {errorMessages.directAnswer && (
          <p className="text-red-500 text-sm mt-1">
            {errorMessages.directAnswer}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Description/File Upload */}
        <label className="block text-gray-600 text-sm mb-2">
          Upload Document & Add Description
        </label>
        <TextArea
          placeholder="Describe how this Document answers the question"
          value={question && question.description}
          onChange={(value) => handleChange("description", value)}
        />
        {errorMessages.description && (
          <p className="text-red-500 text-sm mt-1">
            {errorMessages.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="flex">
            <input
              type="file"
              multiple
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => addFile(e)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-gray-200 rounded text-center px-4 py-2 cursor-pointer text-xs text-gray-800"
            >
              Browse Files
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-between">
        <Button
        disabled={!question}
          color="DarkPink"
          text="Add & Resend to AI"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
          classes=" ml-auto w-full md:w-auto px-6 py-3 bg-[#A732A7] text-white text-sm font-medium 
          rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  );
};

export default IssueFormComponent;
