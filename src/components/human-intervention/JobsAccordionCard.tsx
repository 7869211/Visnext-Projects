import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { LuClock } from "react-icons/lu";
import { LiaPlusCircleSolid } from "react-icons/lia";

import EmailEditor from "../ui/EditEmailJob";
import { MdAlarm } from "react-icons/md";
import EditMeetingJobForm from "../ui/EditMeetingJobForm";
import FollowUpForm from "../ui/FollowUpAddForm";
import ReferralForm from "../ui/EditReferralJob";
import {
  convertStringWithoutDash,
  formatDate,
  getTimeInHHmm,
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils";
import { jobTitles } from "@/common/constants";
import { JobTitleKey } from "@/common/types";
import {
  Interventions,
  JobRes,
  JobTypes,
  Recipient,
} from "@/common/interfaces";
import { ContextualError, MeetingDetails } from "@/interfaces";
import useUserStore from "@/store/userStore";
import { handleApiError } from "@/lib/errorHandler";
import apiClient from "@/services/apiClient";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import { removeJobFromDetail } from "@/common/helpers";
interface JobsCardProps {
  id: number | null;
  emailTitle: JobTitleKey;
  emailTo: string;
  emailSubject: string;
  emailDesc: string;
  openItem: number | null;
  follow_up_date?: string;
  isEditMode?: boolean;
  toggleAccordion: (index: number, isAddMode?: boolean) => void;
  jobType?: JobTypes | JobRes;
  index?: number;
}

const JobsAccordionCard: React.FC<JobsCardProps> = ({
  emailTitle,
  emailTo,
  emailSubject,
  emailDesc,
  id,
  openItem,
  follow_up_date,
  isEditMode,
  toggleAccordion,
  jobType,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(isEditMode || false);
  const { issueReasonsDetail, setIssueReasonsDetail, organizationId } =
    useIssueReasonsStore();
  const { user } = useUserStore();
  const jobTypeKey = (jobType as JobRes)?.job?.job_type;
  const handleSave = (data: string | MeetingDetails | Recipient) => {
    let dataObject;
    if (typeof data === "string") {
      dataObject = JSON.parse(data);
    } else {
      dataObject = data;
    }
    console.log(dataObject);
    if (isEditMode) {
      toggleAccordion((jobType as JobRes)?.id || 0, true);
    } else {
      setIsEditing((prev) => !prev);
    }
  };
  let orgId = -1;
  if (user && user.organisations.length > 0) {
    orgId = user.organisations[0].id;
  }
  const ORGANIZATION_ID = organizationId || orgId;

  const handleCancel = () => {
    if (isEditMode) {
      toggleAccordion((jobType as JobRes)?.id || 0, true);
    }
    setIsEditing((prev) => !prev);
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };
  // deleteJob hit the delete api /organisations/{organisation_id}/interventions/{issue_id}/jobs/{job_id}
  const deleteJob = async (issueId: number | null) => {
    try {
      const response = await apiClient.delete(
        `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/jobs/${
          (jobType && jobType.id) || 0
        }`
      );

      if (response.status === 200) {
        const jobIdToRemove = (jobType && jobType.id) || 0;

        const updatedData = removeJobFromDetail(
          issueReasonsDetail,
          jobIdToRemove
        ) as Interventions;
        setIssueReasonsDetail(updatedData);

        showSuccessToast("Job delete Successful!");
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
  return (
    <div className="rounded-xl border border-[#CBD2E0] bg-white mb-4 ">
      {!isEditing && (
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-1">
            <div
              className="hover:cursor-pointer flex items-center"
              onClick={() => toggleAccordion(index || 0)}
            >
              {emailTitle === jobTitles.REFERRAL.key ? (
                <LuUsers className="text-xl text-[#8C268C] me-2 " />
              ) : emailTitle === jobTitles.SEND_FOLLOW_UP_EMAIL.key ? (
                <MdAlarm className="text-xl text-[#8C268C] me-2 " />
              ) : emailTitle === jobTitles.SEND_EMAIL.key ? (
                <HiOutlineEnvelope className="text-xl text-[#8C268C] me-2 " />
              ) : jobTypeKey === jobTitles.SCHEDULE_FOLLOW_UP.key ||
                jobTypeKey === jobTitles.PUT_ON_HOLD.key ? (
                <LuClock className="text-xl text-[#8C268C] me-2 " />
              ) : jobTypeKey === jobTitles.CREATE_MEETING.key ||
                jobTypeKey === jobTitles.meeting.key ? (
                <MdOutlineCalendarMonth className="text-xl text-[#8C268C] me-2 " />
              ) : (
                <LiaPlusCircleSolid className="text-xl text-[#8C268C] me-2 " />
              )}
              <div className="text-[#512652] font-medium text-[13px]">
                {jobTitles[emailTitle]?.value || "Other"}
              </div>
            </div>
            <div className="py-0 px-2 rounded-md bg-[#f0f1f3] text-[#babec8] font-semibold text-sm">
              {emailTitle === jobTitles.REFERRAL.key ? (
                <p>Referral</p>
              ) : emailTitle === jobTitles.SEND_EMAIL.key ? (
                <p>Email</p>
              ) : emailTitle === jobTitles.SEND_FOLLOW_UP_EMAIL.key ||
                jobTypeKey === jobTitles.SCHEDULE_FOLLOW_UP.key ||
                jobTypeKey === jobTitles.PUT_ON_HOLD.key ? (
                <p>Follow Up</p>
              ) : jobTypeKey === jobTitles.CREATE_MEETING.key ||
                jobTypeKey === jobTitles.meeting.key ? (
                <p>Meeting</p>
              ) : (
                <p>Other</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 ml-2">
            <FaRegEdit
              className="text-lg text-[#8C268C] cursor-pointer"
              onClick={handleEditClick}
            />
            <LuTrash2
              className="text-lg text-[#8C268C] cursor-pointer"
              onClick={() => deleteJob(id)}
            />
            <FaAngleDown
              className={`text-lg text-[#8C268C] transition-transform cursor-pointer ${
                openItem === id ? "rotate-180" : "rotate-0"
              }`}
              onClick={() => toggleAccordion(id || 0)}
            />
          </div>
        </div>
      )}
      {!isEditing ? (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openItem === index ? "max-h-40 overflow-y-auto" : "max-h-0"
          }`}
        >
          <div className="pb-3 px-4 flex flex-col gap-3 mb-4">
            {(jobTypeKey === jobTitles.SCHEDULE_FOLLOW_UP.key ||
              jobTypeKey === jobTitles.PUT_ON_HOLD.key) && (
              <>
                <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                  <span className="font-medium text-[#575D6D]">
                    Follow Up Date:{" "}
                  </span>
                  <span className="text-[#858B9B]">
                    {(follow_up_date && formatDate(follow_up_date)) || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                  <span className="font-medium text-black">Type:</span>
                  <span className="text-[#858B9B]">
                    {jobTitles[emailTitle]?.title}
                  </span>
                </div>
              </>
            )}
            {jobTypeKey !== jobTitles.SCHEDULE_FOLLOW_UP.key &&
              jobTypeKey !== jobTitles.PUT_ON_HOLD.key && (
                <>
                  <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                    {emailTo ? (
                      <span>
                        <span className="text-[#575D6D] font-medium">To: </span>
                        {emailTo}
                      </span>
                    ) : jobTitles[emailTitle]?.value ? (
                      <span className="text-[#575D6D] font-medium">
                        Select Meeting Date:
                        <span className="text-[#858b9b] text-sm">
                          {(follow_up_date && formatDate(follow_up_date)) ||
                            "N/A"}
                        </span>
                      </span>
                    ) : (
                      <>
                        <span className="font-medium text-black">Type:</span>
                        <span className="text-[#858B9B]">
                          {convertStringWithoutDash(
                            (jobType as JobRes)?.job?.job_type
                          )}
                        </span>
                      </>
                    )}
                  </div>
                  {(jobType as JobRes)?.job?.meeting && (
                    <>
                      {" "}
                      <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                        <span className="text-[#575D6D] font-medium">
                          Start Time:{" "}
                          <span className="text-[#858b9b] text-sm">
                            {getTimeInHHmm(
                              (jobType as JobRes)?.job?.meeting?.start
                            ) || "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                        <span className="text-[#575D6D] font-medium">
                          End Time:{" "}
                          <span className="text-[#858b9b] text-sm">
                            {getTimeInHHmm(
                              (jobType as JobRes)?.job?.meeting?.end
                            ) || "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                        <span className="text-[#575D6D] font-medium">
                          User:
                          <span className="text-[#858b9b] text-sm">
                            {" "}
                            {(jobType as JobRes)?.job?.user
                              ? (jobType as JobRes)?.job?.user?.first_name +
                                " " +
                                (jobType as JobRes)?.job?.user?.last_name
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                        <span className="text-[#575D6D] font-medium">
                          All Attendees:{" "}
                          <span className="text-[#858b9b] text-sm">
                            {(jobType as JobRes)?.job?.meeting?.attendees
                              ?.map((item: { address: string }) => item.address)
                              .join(",") || "N/A"}
                          </span>
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2 text-[#858b9b] text-sm">
                    {emailDesc && (
                      <span>
                        <span className="text-[#575D6D] font-medium">
                          Subject:{" "}
                        </span>{" "}
                        {emailSubject}
                      </span>
                    )}
                  </div>
                  <div className="text-[#858b9b] text-sm">{emailDesc}</div>
                </>
              )}
          </div>
        </div>
      ) : emailTitle === jobTitles.meeting.key ? (
        <EditMeetingJobForm
          onCancel={handleCancel}
          onSave={handleSave}
          issueId={id}
          isAddForm={isEditMode || false}
        />
      ) : emailTitle === jobTitles.REFERRAL.key ? (
        <ReferralForm
          onCancel={handleCancel}
          onSave={handleSave}
          issueId={id}
          isAddForm={isEditMode || false}
        />
      ) : emailTitle === jobTitles.SEND_EMAIL.key ? (
        <EmailEditor
          onCancel={handleCancel}
          onSave={handleSave}
          issueId={id}
          emailTitle={emailTitle}
          isAddForm={isEditMode || false}
        />
      ) : emailTitle === jobTitles.SEND_FOLLOW_UP_EMAIL.key ||
        jobTitles.SCHEDULE_FOLLOW_UP.key ? (
        <FollowUpForm
          onCancel={handleCancel}
          onSave={handleSave}
          issueId={id}
          isAddForm={isEditMode || false}
        />
      ) : null}
    </div>
  );
};

export default JobsAccordionCard;
