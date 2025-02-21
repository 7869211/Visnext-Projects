"use client";

import React from "react";
import AuthPageLayout from "@/pages/layouts/AuthPageLayout";
import StepForm from "./StepForm";
import { CREATE_ACCOUNT_FORMS_DETAIL } from "@/common/constants";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import useUserStore from "@/store/userStore";

const CreateAccountLayout: React.FC = () => {
  const { user } = useUserStore();
  const { currentStep } = useRegistrationStore();
  const title =
    currentStep > 0
      ? CREATE_ACCOUNT_FORMS_DETAIL[currentStep || 0]?.title.replace(
          "{{name}}",
          user?.first_name || ""
        )
      : CREATE_ACCOUNT_FORMS_DETAIL[currentStep || 0]?.title;
  const subTitle = CREATE_ACCOUNT_FORMS_DETAIL[currentStep || 0]?.subTitle;

  return (
    <AuthPageLayout title={title} subtitle={subTitle} actions={<StepForm />} />
  );
};

export default CreateAccountLayout;
