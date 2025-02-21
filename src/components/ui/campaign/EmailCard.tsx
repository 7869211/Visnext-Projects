import React from 'react';
import { ISequences } from '@/interfaces';
interface MemberCardProps {
    index: number
    email: ISequences
}

const EmailCard: React.FC<MemberCardProps> = ({ index, email }) => {
    return (
        <div className="flex justify-between gap-2 px-5 py-3 text-[#575D6D] items-center">
            <span className="text-sm font-medium truncate ">{(index+1) + ' ' + email.subject}</span>
            <div className="bg-[#F7F8F9] rounded-3xl w-[80px] text-center h-[26px]">
                <span className="text-[10px] font-semibold leading-3 flex-none">{email.delay_minutes} Day Wait</span>
            </div>
        </div>
    );
};

export default EmailCard;
