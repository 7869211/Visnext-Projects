import React, { useCallback, useEffect } from "react";
import CircleCheckBox from "@/components/ui/CircleCheckBox";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import apiClient from "@/services/apiClient";
import { UPDATE_USER_ONBOARDING, USER_CALENDARS } from "@/common/endpoints";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import { useRouter } from "next/router";
import useUserStore from "@/store/userStore";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
const CalendarsForm: React.FC = () => {
  const router = useRouter();
  const { fetchUserData } = useUserStore();
  const { currentStep, submitForm, setSubmitForm } = useRegistrationStore();
  const { calendars, fetchCalendarData, setCalendars } = useCalendarStore();
  const handleToggle = (index: number) => {
    if (calendars) {
      calendars[index].isSelected = !calendars[index].isSelected;
      setCalendars(calendars);
    }
  };

  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        if (!calendars) {
          await fetchCalendarData();
        }
      } catch (error) {
        showErrorToast(`Failed to fetch calender data ${error}`);
      }
    };

    initializeCalendar();
  }, [calendars, fetchCalendarData]);

  const updateUserProfile = useCallback(async () => {
    try {
      await apiClient.put(UPDATE_USER_ONBOARDING, {
        shown_onboarding: true,
      });

      setSubmitForm(false);
      await fetchUserData();
      showSuccessToast("Account Created successfully!");
      router.replace("/home");
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
  }, [fetchUserData, router, setSubmitForm]);

  const submit = useCallback(async () => {
    const data = {
      ids: calendars?.filter((x) => x.isSelected).map((y) => y.id),
    };
    console.log(data, currentStep);
    if (!data || (data?.ids && data.ids.length < 1)) {
      console.log("Please enable at least one calendar.");
      setSubmitForm(false);
      return;
    }
    try {
      await apiClient.put(USER_CALENDARS, data);
      console.log("Availability calendar successfully!");

      await updateUserProfile();
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
  }, [calendars, currentStep, setSubmitForm, updateUserProfile]);

  useEffect(() => {
    if (submitForm) {
      submit();
    }
  }, [submitForm, submit]);

  return (
    <>
      <div className="text-sm text-end mb-3 mt-7">Check for availability</div>
      <div>
        {calendars &&
          calendars.map((calendar, index) => (
            <div
              className="py-[12px] px-[24px] flex items-center justify-between rounded-md hover:bg-[#521252] cursor-pointer mb-2 h-[65px]"
              onClick={() => handleToggle(index)}
              key={index}
            >
              <p className="mb-0 text-[16px] tracking-[0.4px] font-[400]">
                {calendar.title}
              </p>
              <div>
                <CircleCheckBox
                  selected={calendar.isSelected || false}
                  onToggle={() => false}
                  isDarkMode={true}
                  classes="!h-[1.8rem] !w-[1.8rem]"
                />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default CalendarsForm;
