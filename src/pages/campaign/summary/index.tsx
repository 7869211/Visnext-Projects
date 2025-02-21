import React, { useState } from 'react';
import DataList from '@/components/ui/campaign/DataList';
import useCampaignStore from '@/store/campaignStore';
import MemberCard from '@/components/ui/campaign/MemberCard';
import EmailCard from '@/components/ui/campaign/EmailCard';

const SummaryPage: React.FC = () => {
    const { campaign } = useCampaignStore();
    const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());
    
    const toggleSelection = (index: number) => {
        setSelectedDocs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    return (
        <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-3">
                <span className="text-base text-[#30343E] font-medium">Members</span>
                <div className="grid grid-cols-3 gap-4">
                    {campaign?.members.map((member) => (
                        <MemberCard key={member.id.toString()} member={member} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-base text-[#30343E] font-medium">Email Sequence</span>
                <div className={`flex flex-col ${campaign?.sequences.length > 0 && `bg-white border border-[#F0F1F3] rounded-lg`}`}>
                    {campaign?.sequences?.map((email, index) => (
                        <EmailCard key={index} index={index} email={email} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-base text-[#30343E] font-medium">Documents</span>
                <DataList
                    tooltip={false}
                    items={campaign?.documents}
                    selectedDocs={selectedDocs}
                    onToggleSelect={toggleSelection}
                    height="150px"
                />
            </div>
            <div className="flex flex-col gap-3">
                <span className="text-base text-[#30343E] font-medium">FAQs</span>
                <div className={`${campaign?.faqs.length > 0 && `border rounded-lg px-7 py-3`}  bg-white`}>
                    <DataList
                        tooltip={false}
                        items={campaign?.faqs}
                        selectedDocs={selectedDocs}
                        onToggleSelect={toggleSelection}
                        direction="col"
                        border={false}
                        type='faq'
                    />
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
