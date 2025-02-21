"use client";

import React, { useEffect, useState, useCallback } from "react";
import Input from "@/components/ui/Input";
import useUserStore from "@/store/userStore";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import {
  CREATE_ACCOUNT_FORMS_DETAIL,
  platforms_data,
} from "@/common/constants";
import apiClient from "@/services/apiClient";
import { UPDATE_USER_MEETING } from "@/common/endpoints";
import { handleApiError } from "@/lib/errorHandler";
import Image from "next/image";
import { MeetingPlatforms } from "@/common/enums";
import { ContextualError } from "@/interfaces";
import { showErrorToast } from "@/lib/utils";

const MeetingSoftwareForm: React.FC = () => {
  const items = platforms_data;
  const { user, fetchUserData } = useUserStore();
  const [meetingInfo, setMeetingInfo] = useState(user?.meeting_link || "");
  const { currentStep, setCurrentStep, submitForm, setSubmitForm, platform } =
    useRegistrationStore();

  let platformInfo = platform;
  if (typeof window !== "undefined") {
    platformInfo = localStorage.getItem("platform");
  }
  const index = items.findIndex((r) => r.title === platformInfo);
  items[index].isShow = true;

  const [activeIndex, setActiveIndex] = useState(index >= 0 ? index : 0);

  const submit = useCallback(async () => {
    if (items[activeIndex]?.isRequiredLink && !meetingInfo) {
      console.log("Please fill required field.");
      setSubmitForm(false);
      return;
    } else if (!items[activeIndex]?.isRequiredLink) {
      setSubmitForm(false);
      setCurrentStep(
        Math.min(currentStep + 1, CREATE_ACCOUNT_FORMS_DETAIL.length - 1)
      );
    }

    try {
      await apiClient.put(UPDATE_USER_MEETING, { meeting_link: meetingInfo });
      console.log("Meeting link setup successfully!");

      setCurrentStep(
        Math.min(currentStep + 1, CREATE_ACCOUNT_FORMS_DETAIL.length - 1)
      );
      setSubmitForm(false);
      await fetchUserData();
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        setSubmitForm(false);
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
    items,
    activeIndex,
    meetingInfo,
    setCurrentStep,
    currentStep,
    setSubmitForm,
    fetchUserData,
  ]);

  useEffect(() => {
    if (submitForm) {
      submit();
    }
  }, [submit, submitForm]);

  return (
    <>
      <div className="mt-7">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <>
            {item.isShow && <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`border-2 border-[#8C268C] bg-[#330A33] rounded-lg p-1 text-center cursor-pointer meeting_boxes ${
                activeIndex === index ? "active_box" : ""
              }`}
            >
              <div
                className={`rounded-lg p-6 flex items-center justify-center flex-col meeting_box_inner ${
                  activeIndex === index ? "bg-white" : "bg-[#330A33]"
                }`}
              >
                <div className="text-center">
                  <Image src={item.svg} alt="Platform" width={60} height={60} />
                </div>
                <h2
                  className={`${
                    activeIndex === index ? "text-[#A732A7]" : "text-white"
                  } mt-4 text-lg font-medium`}
                >
                  {item.title}
                </h2>
              </div>
            </div>}
            </>
          ))}
        </div>
        {items[activeIndex]?.isRequiredLink && (
          <div className="relative w-full mt-5">
            <Input
              label={
                items[activeIndex]?.title === MeetingPlatforms.ZOOM
                  ? "Personal Meeting ID"
                  : "Meeting Link"
              }
              mode="dark"
              placeholder={
                items[activeIndex]?.title === MeetingPlatforms.ZOOM
                  ? "XXX-XXX-XXXX"
                  : "Meeting URL"
              }
              value={meetingInfo}
              onChange={(value) => setMeetingInfo(value)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MeetingSoftwareForm;

export async function getServerSideProps() {
  return {
    props: {
      platformData: null, // Fetch data server-side if required, or keep it null
    },
  };
}
