import React, { FC, ReactNode } from 'react';
import useCampaignStore from '@/store/campaignStore';
import Button from '@/components/ui/Button';
import FeatureIcon from '@/components/ui/FeatureIcon';
import { FaFile, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import useOrganizationStore from '@/store/organizationStore';
import apiClient from '@/services/apiClient';
import useUserStore from '@/store/userStore';

interface CampaignLayoutProps {
    children: ReactNode;
    onPrevTab: () => void;
    onNextTab: () => void;
    tabFlag: boolean;
}

const CampaignLayout: FC<CampaignLayoutProps> = ({ children, onPrevTab, onNextTab, tabFlag = false }) => {
    const { organization, updateOrgCampaign } = useOrganizationStore();
    const { campaign, setCampaign } = useCampaignStore();
    const { id, name, email_tracking, auto_pilot, link_tracking } = campaign;


    const { user } = useUserStore();

    const organisationId = user?.organisations[1]?.id;

    const router = useRouter();

    async function onComplete(): Promise<void> {
        if (!name || name.trim() === "") {
            setCampaign({ name: "New Campaign Template" });
        }

        const organizationCampaign = organization?.campaigns.find(
            (orgCampaign) => orgCampaign.id === campaign.id
        );

        if (organizationCampaign && organizationCampaign.name !== name) {
            try {
                const endpoint = `/organisations/${organisationId}/campaigns/${id}/update-name`;

                await apiClient.put(endpoint, { name });

                updateOrgCampaign(id!, { name });

                console.log("Campaign name updated successfully.");
            } catch (error) {
                console.error("Failed to update campaign name:", error);
            }
        }
        
        router.replace("/campaign");
    }
    return (
        <div className="flex flex-col z-30 bg-[#F7F8F9]">
            <header className="flex-none bg-white pb-12">
                <div className="w-[950px] flex flex-col gap-6 mt-16 mx-auto">
                    <h1 className="text-3xl font-bold text-[#8C268C]">
                        {name || 'New Campaign Template'}
                    </h1>
                    <div className="flex flex-row gap-6 h-[20px] items-center text-[#858B9B] text-xs font-medium">
                        <div className="flex">
                            <FeatureIcon label="email_tracking" status={email_tracking} />
                            <span className="px-1">EMAIL OPEN RATE TRACKING</span>
                        </div>
                        <div className="flex">
                            <FeatureIcon label="auto_pilot" status={auto_pilot} />
                            <span className="px-1">AUTO-PILOT</span>
                        </div>
                        <div className="flex">
                            <FeatureIcon label="link_tracking" status={link_tracking} />
                            <span className="px-1">LINK TRACKING</span>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex bg-[#F7F8F9] min-h-[calc(100vh-380px)]">{children}</main>
            <footer className="flex justify-between w-[950px] pt-6 pb-16 mt-12 mx-auto z-10 border-t-2 border-[#F0F1F3]">
                <Button
                    width="150px"
                    height="48px"
                    color="Gray"
                    icon={<FaFile className="w-5 h-5" />}
                    text="Save Draft"
                    textSize="lg"
                    textColor="#30343E"
                    padding="sm"
                    onClick={onComplete}
                />
                <div className="flex gap-3">
                    {!tabFlag ?
                        <>
                            <Button
                                width="48px"
                                height="48px"
                                color="DarkPink"
                                icon={<FaAngleLeft className="w-5 h-5" />}
                                text=""
                                textSize="lg"
                                textColor="white"
                                padding="sm"
                                onClick={onPrevTab}
                            />
                            <Button
                                width="48px"
                                height="48px"
                                color="DarkPink"
                                icon={<FaAngleRight className="w-5 h-5" />}
                                text=""
                                textSize="lg"
                                textColor="white"
                                padding="sm"
                                onClick={onNextTab}
                            />
                        </> :
                        <Button
                            width="78px"
                            height="48px"
                            color="DarkPink"
                            text="Done"
                            textSize="lg"
                            textColor="white"
                            padding="sm"
                            onClick={onComplete}
                        />}
                </div>
            </footer>
        </div>
    );
};

export default CampaignLayout;
