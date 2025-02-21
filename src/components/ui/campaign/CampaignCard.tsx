import React, { FC } from 'react';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import Button from'@/components/ui/Button'
import FeatureIcon from '../FeatureIcon';

interface CampaignCardProps {
    name: string;
    features: {
        [key: string]: boolean;
    };
    openCampaignClick: () => void;
}

const allFeatures = [
    { label: "Email Open Rate Tracking", key: "email_tracking" },
    { label: "Auto-Pilot", key: "auto_pilot" },
    { label: "Link Tracking", key: "link_tracking" },
];

interface FeatureProps {
    label: string;
    text: string;
    status: boolean
}

const Feature: FC<FeatureProps> = ({ label, text, status }) => (
    <div className="flex flex-row justify-between items-center gap-1.5 p-0.5">
        <span className="text-[10px] text-[#434956]">{text}</span>
        <FeatureIcon label={label} status={status} />
    </div>
);

const CampaignCard: FC<CampaignCardProps> = ({ name, features, openCampaignClick }) => (
    <div className="flex min-h-[180px] border border-[#F0F1F3] rounded-lg bg-white z-50">
        <div className="flex flex-col w-full p-3 gap-1">
            <div className="h-8 flex flex-row justify-between items-center">
                <span className="text-sm font-semibold text-[#575D6D]">{name}</span>
                <IoEllipsisHorizontalSharp className="h-5 w-5 text-[#8C268C]" />
            </div>
            <div className="grow flex flex-col gap-1.5 p-1.5">
                {allFeatures.map((feature) =>
                    <Feature key={feature.key} text={feature.label} label={feature.key} status={features[feature.key]}/>
                )}
            </div>
            <div className="flex flex-row justify-between items-center">
                <span className="text-[10px] text-[#575D6D]">
                    Campaign Template
                </span>
                <Button
                    width="50px"
                    height="24px"
                    color="DarkPink"
                    text="OPEN"
                    textSize="xs"
                    textColor="white"
                    padding="sm"
                    onClick={openCampaignClick}
                />
            </div>
        </div>
    </div>
);

export default CampaignCard;
