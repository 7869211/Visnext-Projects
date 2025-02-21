import React, { ReactNode } from "react";
// import IssueFormComponent from "@/components/ui/IssueForm";

interface IssueReasonNotificationProps {
  notification: string;
  icon: ReactNode;
  crossIcon?: ReactNode;
  onClose: (value: boolean) => void;
}
const IssueReasonNotification: React.FC<IssueReasonNotificationProps> = ({
  notification,
  icon,
  crossIcon,
  onClose,
}) => {
  return (
    <>
      <div className="cc_field flex items-center self-stretch p-4 rounded-xl bg-white">
        <div className="flex items-center gap-2 self-stretch" onClick={() => onClose(true)}>
          <div>{icon}</div>
          <div className="flex justify-center items-center w-full gap-2.5 py-1 px-3 rounded-md bg-[#f8e9f8] text-[#512652] ">
            {notification}
          </div>
        </div>
          <div className="ml-auto ">
            <button
              onClick={() => onClose(false)}
              className="hover:cursor-pointer"
            >
              {crossIcon}
            </button>
          </div>
        {/* intentionally hidden to some testig */}
        {/* <div className="">
                          <IssueFormComponent onSubmit={()=>handleFormSubmit} />
                          </div> */}
      </div>
    </>
  );
};

export default IssueReasonNotification;
