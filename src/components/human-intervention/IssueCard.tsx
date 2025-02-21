import React from "react";
import Image from "next/image";
import ClockIcon from "@/assets/images/clock.svg";
import BuildingIcon from "@/assets/images/building.svg";
import InfoIcon from "@/assets/images/info.svg";

interface IssueCardProps {
  issueId: string;
  time: string;
  companyName: string;
  interventionText: string;
  isActive: boolean;
  onClick: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issueId,
  time,
  companyName,
  interventionText,
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`issue_card hover:cursor-pointer flex flex-col items-start gap-2.5 self-stretch p-3 rounded-xl border border-[#f0f1f3] bg-[#fff] hover:bg-[#f8e9f8] mb-[16px] ${
        isActive ? "!bg-[#f8e9f8]" : ""
      }`}
      style={{
        boxShadow:
          "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="flex justify-between items-center self-stretch">
        <p className="mb-0 text-[#CC66CC] text-[14px] font-[500]">{issueId}</p>
        <div className="flex items-center gap-2">
          <Image src={ClockIcon} alt="clock icon" />
          <div className="text-[#CC66CC] font-[400] text-[14px]">{time}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Image src={BuildingIcon} alt="building icon" />

        <p className="text-[#512652] font-[500] text-[16] mb-0">
          {companyName}
        </p>
      </div>
      <div className="flex items-center gap-2 self-stretch">
        <Image src={InfoIcon} alt="info icon" />
       
        <p className="mb-0 max-h-[75px] text-[#512652] font-[400] text-[14px] px-3 py-2 bg-[#F8E9F8] rounded-lg line-clamp-3">
          {interventionText}
        </p>
      </div>
    </div>
  );
};

export default IssueCard;
