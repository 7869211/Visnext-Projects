import React from 'react';
import { IMember } from '@/interfaces';
interface MemberCardProps {
    member: IMember
    key: string;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    return (
        <div className="flex flex-col border rounded-lg py-4 px-5 gap-3 bg-white z-30">
            <span className="text-base font-medium text-[#575D6D]">
                {member.first_name + ' ' + member.last_name}
            </span>
            <span className="text-xs text-[#858B9B]">{member.email}</span>
            <span className="text-[10px] text-[#575D6D]">{member.role}</span>
        </div>
    );
};

export default MemberCard;
