import { useState, useCallback } from "react";
import { CalendarIcon, Clock } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { cn } from "@/lib/utils";
import DatePickerComponent from "./DatePickerComponent";
import apiClient from "@/services/apiClient";
import { handleApiError } from "@/lib/errorHandler";    
import { ContextualError } from "@/interfaces";
import { showSuccessToast, showErrorToast } from "@/lib/utils";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import { updateIssueReasonsDetailJobs } from "@/common/helpers";
import { Interventions } from "@/common/interfaces";

interface FollowUpProps {
  onSave: (body: string) => void;
  onCancel: () => void;
  issueId: number | null;
  isAddForm: boolean;
}

const FollowUpForm: React.FC<FollowUpProps> = ({
  onCancel,
  issueId,
  isAddForm,
}) => {
  const { organizationId } = useIssueReasonsStore();
  const { issueReasonsDetail, setIssueReasonsDetail } = useIssueReasonsStore();
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<
    "follow-up" | "on-hold" | null
  >("follow-up");
  const [followUpDate, setFollowUpDate] = useState<string>("");

  // Handle changes in the input field (for follow-up date)
  const handleChange = (value: string) => {
    setFollowUpDate(value);
  };

  const handleFollowUpTypeChange = (type: "follow-up" | "on-hold") => {
    setSelectedButton(type);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setFollowUpDate(date.toISOString().split("T")[0]); // Set date in string format (YYYY-MM-DD)
    }
    setDatePickerOpen(false);
  };

  const handleDateClick = () => {
    setDatePickerOpen((prev) => !prev);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSave = useCallback(async () => {
    try {
      if (selectedButton === "follow-up") {
        const response = await apiClient.post(
          `/organisations/${organizationId}/interventions/${issueId}/create/schedule-follow-up-job`,
          { follow_up: followUpDate }
        );
        if (response.status === 200) {
          showSuccessToast("Follow Up Job Created Successfully");

          const updatedData = updateIssueReasonsDetailJobs(
            issueReasonsDetail,
            response.data
          ) as Interventions;
          setIssueReasonsDetail(updatedData);
        }
      } else if (selectedButton === "on-hold") {
        const response = await apiClient.post(
          `/organisations/${organizationId}/interventions/${issueId}/create/put-on-hold-job`,
          { follow_up: followUpDate }
        );
        if (response.status === 200) {
          const updatedData = updateIssueReasonsDetailJobs(
            issueReasonsDetail,
            response.data
          ) as Interventions;
          setIssueReasonsDetail(updatedData);
          showSuccessToast("Put On Hold Job Created Successfully");
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
        }
      }
    }
  }, [
    followUpDate,
    issueId,
    selectedButton,
    issueReasonsDetail,
    setIssueReasonsDetail,
    organizationId
  ]);

  return (
    <div className="max-w-full max-w-full h-[330px] p-4">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-medium text-[#512652]">
          <Clock className="h-5 w-5 text-[#8C268C]" />
          {isAddForm ? "" : "Edit"} Follow Up
        </h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2 mt-5">
          <label className="block text-sm text-[#575D6D]">
            Select Follow Up Date
          </label>
          <div className="flex items-center gap-1">
            <Input
              type="text"
              placeholder="Follow Up Date"
              value={followUpDate}
              onChange={(value) => handleChange(value)}
              customStyles="border-gray-100 border-2 placeholder-[#575D6D] w-full sm:flex-grow sm:w-auto"
            />
            <div
              className="w-[70px] h-[58px] flex justify-center items-center border-2 border-gray-100 rounded-md cursor-pointer"
              onClick={handleDateClick}
            >
              <CalendarIcon className="w-5 h-5 text-[#8C268C]" />
            </div>
          </div>

          {datePickerOpen && (
            <div className="absolute z-10 right-[32px]">
              <DatePickerComponent
                selectedDate={
                  followUpDate ? new Date(followUpDate) : new Date()
                }
                // selected={followUpDate ? new Date(followUpDate) : null}
                onDateChange={handleDateSelect}
                // dateFormat="MMMM d, yyyy"
                // inline={false}
                // onClickOutside={() => setDatePickerOpen(false)}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-[#575D6D]">Follow Up Type</p>
          <div className="relative flex h-10 rounded-md border border-[#F2F4F7] bg-[#F7F8F9] p-1">
            <button
              type="button"
              className={cn(
                "relative flex-1 rounded-sm text-sm font-medium transition-all duration-300",
                selectedButton === "follow-up"
                  ? "text-[#512652] bg-white rounded-md shadow-lg"
                  : "text-[#4A5468] bg-transparent"
              )}
              onClick={() => handleFollowUpTypeChange("follow-up")}
            >
              Follow Up
            </button>
            <button
              type="button"
              className={cn(
                "relative flex-1 rounded-sm text-sm font-medium transition-all duration-300",
                selectedButton === "on-hold"
                  ? "text-[#512652] bg-white rounded-md shadow-lg"
                  : "text-[#4A5468] bg-transparent"
              )}
              onClick={() => handleFollowUpTypeChange("on-hold")}
            >
              Put On Hold
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-3 pt-7">
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
    </div>
  );
};

export default FollowUpForm;
