import React from "react";
import { LuMail } from "react-icons/lu";
import DOMPurify from 'dompurify';

interface EmailThreadCardProps {
  from: string;
  to: string;
  subject: string;
  date: string;
  body: string;
}

const EmailThreadCard: React.FC<EmailThreadCardProps> = ({
  from,
  to,
  subject,
  date,
  body,
}) => {
  return (
    <div className="flex flex-col justify-center items-start gap-3 p-4 rounded-xl border border-[#cbd2e0] bg-white mb-[16px]">
      <div className="flex justify-between items-center self-stretch">
        <div className="flex items-center gap-2">
          <LuMail color={"#8C268C"} size="20" />
          <div className="text-[#512652] font-[500] text-[14px]">{from}</div>
        </div>
        <div className="text-[#858B9B] font-[400] text-[13px] truncate ml-2">{date}</div>
      </div>
      <div className="flex items-center gap-2 text-[#858b9b] font-[400] text-[14px]">
        <span className="text-[#575D6D] font-[600] text-[14px]">To: </span> {to}
      </div>
      <div className="flex items-center gap-2 text-[#858b9b] font-[400] text-[14px]">
        <span className="text-[#575D6D] font-[600] text-[14px]">Subject: </span>{" "}
        {subject}
      </div>
      {/* <div className="text-[#858b9b] font-[400] text-[14px] overflow-y-auto overflow-x-hidden w-full max-h-96" >{body}</div> */}
     <div className="text-[#858b9b] font-[400] text-[14px] overflow-y-auto overflow-x-hidden w-full max-h-96" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body)}}></div>
    </div>
  );
};

export default EmailThreadCard;
