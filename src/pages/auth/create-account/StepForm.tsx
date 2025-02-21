"use client";

import Step from "./Step";
import Button from "@/components/ui/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CREATE_ACCOUNT_FORMS_DETAIL } from "@/common/constants";
import { useRegistrationStore } from "@/store/useRegistrationStore";

const StepForm = () => {
  const { currentStep, setCurrentStep, setSubmitForm } = useRegistrationStore();
  // const nextStep = () =>
  //   setCurrentStep( Math.min(currentStep + 1, CREATE_ACCOUNT_FORMS_DETAIL.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  return (
    <div>
      <Step stepName={CREATE_ACCOUNT_FORMS_DETAIL[currentStep]?.name} />
      <hr className="border-t border-[#8C268C] mt-5 mb-5" />
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center gap-1">
          <span className=" text-white">
            {currentStep + 1} of {CREATE_ACCOUNT_FORMS_DETAIL.length}
          </span>{" "}
          <div className="relative">
            <div className="px-4 py-2 text-white bg-transparent rounded-md focus:outline-none focus:none focus:ring-transparent">
              {CREATE_ACCOUNT_FORMS_DETAIL[currentStep]?.displayName}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-1">
          <Button
            disabled={currentStep <= 0}
            width="48px"
            height="48px"
            color="DarkPink"
            icon={<FaAngleLeft className="w-5 h-5" />}
            text=""
            textSize="lg"
            textColor="white"
            padding="sm"
            onClick={prevStep}
          />
          {currentStep !== 3 ? (
            <Button
              disabled={currentStep >= CREATE_ACCOUNT_FORMS_DETAIL.length - 1}
              width="48px"
              height="48px"
              color="DarkPink"
              icon={<FaAngleRight className="w-5 h-5" />}
              text=""
              textSize="lg"
              textColor="white"
              padding="sm"
              onClick={() => setSubmitForm(true)}
            />
          ) : (
            <Button
              width="70px"
              height="48px"
              color="DarkPink"
              text="Done"
              textSize="lg"
              textColor="white"
              padding="sm"
              onClick={() => setSubmitForm(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StepForm;
