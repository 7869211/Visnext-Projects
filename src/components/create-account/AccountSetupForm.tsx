import React, { useCallback, useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import InputWithDropdown from "@/components/ui/InputWithDropdown";
import { COUNTRIES, CREATE_ACCOUNT_FORMS_DETAIL } from "@/common/constants";
import useUserStore from "@/store/userStore";
import apiClient from "@/services/apiClient";
import {
  UPDATE_USER_FIRST_NAME,
  UPDATE_USER_LAST_NAME,
  UPDATE_USER_TIMEZONE,
} from "@/common/endpoints";
import { handleApiError } from "@/lib/errorHandler";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import { ContextualError } from "@/interfaces";
import { useCalendarStore } from "@/store/useCalendarStore";
import { showErrorToast } from "@/lib/utils";

const AccountSetupForm: React.FC = () => {
  const { currentStep, setCurrentStep, submitForm, setSubmitForm } =
    useRegistrationStore();
  const { fetchCalendarData } = useCalendarStore();
  const { user, fetchUserData } = useUserStore();
  const [userInfo, setUserInfo] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    city: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    city: "",
    country: "",
  });

  // Validate inputs
  const validate = useCallback(() => {
    let isValid = true;
    const newErrors = { first_name: "", last_name: "", city: "", country: "" };

    if (!userInfo.first_name.trim()) {
      newErrors.first_name = "First Name is required.";
      isValid = false;
    }
    if (!userInfo.last_name.trim()) {
      newErrors.last_name = "Last Name is required.";
      isValid = false;
    }
    if (!userInfo.city.trim()) {
      newErrors.city = "City is required.";
      isValid = false;
    }
    if (!userInfo.country.trim()) {
      newErrors.country = "Country is required.";
      isValid = false;
    }

    setSubmitForm(false);
    setErrors(newErrors);
    return isValid;
  }, [userInfo, setErrors, setSubmitForm]);

  const handleInputChange = (field: string, value: string) => {
    setUserInfo({ ...userInfo, [field]: value });

    // Clear the error for the field being updated
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };
  const submit = useCallback(async () => {
    if (!validate()) {
      console.log("Please fill all required fields.");
      return;
    }

    try {
      await Promise.all([
        apiClient
          .put(UPDATE_USER_FIRST_NAME, { name: userInfo.first_name })
          .catch((error) => {
            error.context = "Updating First Name";
            throw error;
          }),
        apiClient
          .put(UPDATE_USER_LAST_NAME, { name: userInfo.last_name })
          .catch((error) => {
            error.context = "Updating Last Name";
            throw error;
          }),
        apiClient
          .put(UPDATE_USER_TIMEZONE, {
            city: userInfo.city,
            country: userInfo.country,
          })
          .catch((error) => {
            error.context = "Updating Timezone";
            throw error;
          }),
      ]);

      console.log("Account Setup successfully!");

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
          showErrorToast(`Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`);
        } else {
          showErrorToast("An unexpected error occurred.");
        }
      }
    }
  }, [
    userInfo,
    currentStep,
    fetchUserData,
    setCurrentStep,
    setSubmitForm,
    validate,
  ]);

  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        await fetchCalendarData();
      } catch (error) {
        console.error("Failed to fetch calendar data:", error);
      }
    };

    initializeCalendar();
  }, [fetchCalendarData]);

  useEffect(() => {
    if (submitForm) {
      submit();
    }
  }, [submitForm, submit]);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchUserData();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (!user) {
      initializeUser();
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    if (user) {
      setUserInfo({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        city: "",
        country: "",
      });
    }
  }, [user]);

  return (
    <div className="mt-5 mb-[35px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="relative w-full">
          <Input
            label="First Name"
            value={userInfo?.first_name}
            onChange={(value) => handleInputChange("first_name", value)}
            mode="dark"
          />
          {errors.first_name && (
            <span className="text-xs text-[#903131]">{errors.first_name}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="relative w-full">
          <Input
            label="Last Name"
            value={userInfo?.last_name}
            onChange={(value) => handleInputChange("last_name", value)}
            mode="dark"
          />
          {errors.last_name && (
            <span className="text-xs text-[#903131]">{errors.last_name}</span>
          )}
        </div>

        {/* City */}
        <div className="relative w-full">
          <Input
            label="City"
            mode="dark"
            value={userInfo?.city}
            onChange={(value) => handleInputChange("city", value)}
          />
          {errors.city && (
            <span className="text-xs text-[#903131]">{errors.city}</span>
          )}
        </div>

        {/* Country Dropdown */}
        <div className="relative w-full">
          <InputWithDropdown
            label=""
            mode="dark"
            options={COUNTRIES}
            onSelect={(value) => handleInputChange("country", value)}
            placeholder="Select Country"
          />
          {errors.country && (
            <span className="text-xs text-[#903131]">{errors.country}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSetupForm;
