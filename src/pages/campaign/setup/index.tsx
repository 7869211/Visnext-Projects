import React, { FC, ReactNode, useState } from 'react';
import CampaignLayout from '@/pages/layouts/CampaignLayout';
import TabList from '@/components/ui/campaign/TapList';
import MembersPage from '@/pages/campaign/members';
import CampaignPage from '@/pages/campaign/campaigns';
import DocumentsPage from '@/pages/campaign/documents';
import FAQPage from '@/pages/campaign/faqs';
import SummaryPage from '@/pages/campaign/summary';
import EmailPage from '@/pages/campaign/emails';
import apiClient from '@/services/apiClient';
import { IDocument, IFAQ, INITIAL_DOCUMENT, INITIAL_FAQ, ISequences, INITIAL_EMAIL } from '@/interfaces';
import useOrganizationStore from '@/store/organizationStore';
import useUserStore from '@/store/userStore';
import useCampaignStore from '@/store/campaignStore';

interface CampaignLayoutProps {
    children: ReactNode;
}

interface Tab {
    id: number;
    label: string;
    content: React.ReactNode;
}

const tabs: Tab[] = [
    { id: 0, label: "Campaign", content: <CampaignPage /> },
    { id: 1, label: "Members", content: <MembersPage /> },
    { id: 2, label: "Email Sequence", content: <EmailPage /> },
    { id: 3, label: "Documents", content: <DocumentsPage /> },
    { id: 4, label: "FAQs", content: <FAQPage /> },
    { id: 5, label: "Summary", content: <SummaryPage /> },
];

const CampaignSetupPage: FC<CampaignLayoutProps> = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [tapFlag, setTabFlag] = useState(false);

    const { organization, setOrgDocuments, setOrgFAQs } = useOrganizationStore();
    const { campaign, setDocuments, setEmails } = useCampaignStore();

    const { user } = useUserStore();

    const organisationId = user?.organisations[0]?.id;

    const handleTabChange = (tabIndex: number) => {
        setActiveTab(tabIndex);
        setTabFlag(tabIndex === tabs.length - 1);
    };

    const handleNextTab = () => {
        if (activeTab < tabs.length - 1) {
            handleTabChange(activeTab + 1);
        }
    };

    const handlePrevTab = () => {
        if (activeTab > 0) {
            handleTabChange(activeTab - 1);
        }
    };

    const handleFileUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png";

        input.onchange = async (event: Event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            if (!file) return;

            const fileName = file.name;
            const fileSizeMB = file.size / 1024 / 1024;

            if (fileName.length > 64) {
                alert("File name should not exceed 64 characters.");
                return;
            }

            if (fileSizeMB > 25) {
                alert("File size should not exceed 25MB.");
                return;
            }


            try {
                const formData = new FormData();
                formData.append("description", INITIAL_DOCUMENT.description);
                formData.append("file", file);

                const response = await apiClient.post(
                    `/organisations/${organisationId}/documents/upload`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );

                const newDocument: IDocument = {
                    ...INITIAL_DOCUMENT,
                    id: response.data.id,
                    filename: fileName,
                    size: `${fileSizeMB.toFixed(2)}MB`,
                    isNew: true,
                };
                setOrgDocuments([
                    ...(organization?.documents || []).map((doc) => ({ ...doc, isNew: false })),
                    newDocument,
                ]);

                setDocuments([
                    ...campaign.documents.map((doc) => ({ ...doc, isNew: false })),
                    { ...newDocument, isNew: false },
                ]);
                console.log("File uploaded successfully:", newDocument);
            } catch (error) {
                console.error("Failed to upload file:", error);
            }
        };

        input.click();
    };

    const handleAddFAQ = async () => {
        try {
            const response = await apiClient.post(
                `/organisations/${organisationId}/faqs/create`,
                {
                    question: "New FAQ",
                    answer: "This is sample description for the answer."
                }
            );

            const newFAQ: IFAQ = {
                ...INITIAL_FAQ,
                id: response.data.id,
                isNew: true,
            };

            const updatedFAQs = ([...(organization?.faqs || []).map((doc) => ({ ...doc, isNew: false })),
                newFAQ]);
            setOrgFAQs(updatedFAQs);

            console.log("FAQ created successfully:", newFAQ);
        } catch (error) {
            console.error("Failed to create FAQ:", error);
        }
    };

    const handleAddEmail = async () => {
        const newEmail = {
            delay_minutes: 1,
            email_html:
              "<p>Hi {{ contact.first_name }},</p><p>My name is {{ bot.first_name }}. How are things at {{ contact.company }} going?</p><p>Have you heard of {{ bot.company }} yet?</p>",
            subject: "{{ contact.first_name }}, quick question...",
          };

        try {
            const response = await apiClient.post(
              `/organisations/${organisationId}/campaigns/${campaign.id}/sequences/create`,
              newEmail
            );
        
            if (response && response.data) {        
              const createdEmail: ISequences = {
                ...INITIAL_EMAIL,
                id: response.data.id,
                isActive: true,
                selected: false,
                position: campaign.sequences.length
            };
              setEmails([...campaign.sequences, createdEmail]);

              console.log("Email sequence created successfully:", createdEmail);
            }
          } catch (error) {
            console.error("Error creating email sequence:", error);
          }
    }

    return (
        <div className="bg-[#F7F8F9] w-full">
            <CampaignLayout
                onPrevTab={handlePrevTab}
                onNextTab={handleNextTab}
                tabFlag={tapFlag}
            >
                <TabList
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    handleFileUpload={handleFileUpload}
                    handleAddFAQ={handleAddFAQ}
                    handleAddEmail={handleAddEmail}
                />
            </CampaignLayout>
        </div>
    );
};

export default CampaignSetupPage;
