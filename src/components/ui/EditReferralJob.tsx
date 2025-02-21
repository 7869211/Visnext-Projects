import React, { useState, useCallback } from "react";
import Button from "./Button";
import Input from "./Input";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CgUserAdd } from "react-icons/cg";
import EditorComponent from "./RichText/editor";
import apiClient from "@/services/apiClient";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import useIssueReasonsStore from "@/store/issueReasonsStore";

interface Recipient {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface ReferralFormProps {
  onSave?: (body: Recipient) => void;
  onCancel?: () => void;
  issueId: number | null;
  isAddForm: boolean;
}

const ReferralForm: React.FC<ReferralFormProps> = ({
  onSave,
  onCancel,
  isAddForm,
  issueId,
}) => {
  const { organizationId } = useIssueReasonsStore(); 
  const [recipients, setRecipients] = useState<Recipient[]>([
    { email: "", firstName: "", lastName: "" },
  ]);
  const [referralEmailContent, setReferralEmailContent] = useState(
    "Start typing here..."
  );
  const [thankYouEmailContent, setThankYouEmailContent] = useState(
    "Start typing here..."
  );

  const handleReferralEmailContent = (newContent: string) => {
   //  console.log("Editor content updated:", newContent);
    setReferralEmailContent(newContent);
  };

  const handleThankYouEmailContent = (newContent: string) => {
   //  console.log("Editor content updated:", newContent);
    setThankYouEmailContent(newContent);
  };

  const handleAddRecipient = () => {
    setRecipients([...recipients, { email: "", firstName: "", lastName: "" }]);
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleRecipientChange = (
    index: number,
    field: keyof Recipient,
    value: string
  ) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index][field] = value;
    setRecipients(updatedRecipients);
  };

  const handleSave = useCallback(async () => {
    try {
      for (const recipient of recipients) {
        if (!recipient.email.trim()) {
          showErrorToast("Email address is required for all recipients!");
          return;
        }
        if (recipient.email.includes("@example.com")) {
          showErrorToast("Emails using '@example.com' are not allowed!");
          return;
        }
      }

      if (!referralEmailContent.trim()) {
        showErrorToast("Referral email body is required!");
        return;
      }
      if (!thankYouEmailContent.trim()) {
        showErrorToast("Thank you email body is required!");
        return;
      }

      const payload = {
        contact_email: {
          attachments: [],
          cc: [],
          email_body: {
            html: thankYouEmailContent,
            text: thankYouEmailContent.replace(/<\/?[^>]+(>|$)/g, ""),
          },
        },
        referrals: recipients.map((recipient) => ({
          contact: {
            email_address: recipient.email,
            first_name: recipient.firstName || "",
            last_name: recipient.lastName || "",
          },
          email: {
            attachments: [],
            cc: [],
            email_body: {
              html: referralEmailContent,
              text: referralEmailContent.replace(/<\/?[^>]+(>|$)/g, ""),
            },
          },
        })),
      };

      const response = await apiClient.post(
        `/organisations/${organizationId}/interventions/${issueId}/create/referral-job`,
        payload
      );

      if (response.status === 200) {
        showSuccessToast("Referral job created successfully!");
        if (onSave) {
          onSave(response.data);
        }
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
          console.error("An unexpected error occurred:", error);
        }
      }
    }
  }, [recipients, referralEmailContent, thankYouEmailContent, issueId, onSave, organizationId]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      //  console.log("Cancel button clicked");
    }
  };

  return (
    <div className="max-w-full px-4 py-4 bg-white mx-auto sm:px-4 md:px-6">
      <div className="space-y-4">
        <div className="w-full">
          <div className="flex items-center gap-2">
            <CgUserAdd className="w-5 h-5 text-[#8C268C]" />
            <h1 className="text-sm font-semibold text-[#512652]">
              {isAddForm ? "Create" : "Edit"} Referral Job
            </h1>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Reach out to a referred contact and thank the original referrer.
          </p>
        </div>

        <div className="space-y-2">
          {/* <div className="flex flex-col sm:flex-row gap-8">
            <label className="text-sm text-gray-600">
              Referral
              <span className="block text-sm text-gray-600">Email*</span>
            </label>
            <label className="text-sm text-gray-600 ml-2">
              First Name
              <span className="block text-sm text-gray-600">(Optional)</span>
            </label>
            <label className="text-sm text-gray-600 ml-[-6px]">
              Last Name
              <span className="block text-sm text-gray-600 ">(Optional)</span>
            </label>
          </div> */}
          <div className="overflow-y-auto max-h-48">
            {recipients.map((recipient, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-2 mt-2"
              >
                <Input
                  type="text"
                  placeholder="Customer@example.com"
                  value={recipient.email}
                  customStyles="border-gray-100 border-2 flex-1 h-10"
                  onChange={(value) =>
                    handleRecipientChange(index, "email", value)
                  }
                />
                <Input
                  type="text"
                  placeholder="First Name"
                  value={recipient.firstName}
                  customStyles="border-gray-100 border-2 flex-1 h-10"
                  onChange={(value) =>
                    handleRecipientChange(index, "firstName", value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={recipient.lastName}
                  customStyles="border-gray-100 border-2 flex-1 h-10"
                  onChange={(value) =>
                    handleRecipientChange(index, "lastName", value)
                  }
                />
                <Button
                  color="Gray"
                  text=""
                  icon={<FaRegTrashAlt className="w-4 h-4 text-gray-600" />}
                  onClick={() => handleRemoveRecipient(index)}
                  classes="w-8 h-8 bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          color="Pink"
          text="Add Recipient"
          icon={<FaPlus className="w-5 h-5 text-[#8C268C]" />}
          onClick={handleAddRecipient}
          classes="text-xs bg-[#F8E9F8] text-[#8C268C]"
        />

        <div className="w-full">
          <div className="mb-2">
            <label className="text-sm text-gray-600">Referral Email</label>
          </div>
          <div className="h-44 border-gray-100 border-2 rounded">
            <EditorComponent
              content={referralEmailContent}
              onChange={handleReferralEmailContent}
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

        <div className="w-full py-4">
          <div className="mb-2">
            <label className="text-sm text-gray-600">Thank You Email</label>
          </div>
          <div className="h-44 border-gray-100 border-2 rounded">
            <EditorComponent
              content={thankYouEmailContent}
              onChange={handleThankYouEmailContent}
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

        <div className="flex flex-col md:flex-row justify-between gap-3 pt-8">
          <Button
            color="Gray"
            text="Cancel"
            onClick={handleCancel}
            classes="h-12 w-full md:w-1/2 bg-[#F8E9F8] text-[#8C268C] text-sm !z-10"
          />
          <Button
            color="DarkPink"
            text="Save Changes"
            onClick={handleSave}
            classes="h-12 w-full md:w-1/2 text-sm text-white !z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ReferralForm;
