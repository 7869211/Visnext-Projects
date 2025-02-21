import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import CampaignCard from '@/components/ui/campaign/CampaignCard';
import Image from 'next/image';
import CampaignIcon from '@/assets/images/campign.svg'; // Add your icon path here
import { FaPlus } from 'react-icons/fa';
import useUserStore from '@/store/userStore';
import apiClient from '@/services/apiClient';
import useOrganizationStore from '@/store/organizationStore';
import useCampaignStore from '@/store/campaignStore';
import { INITIAL_CAMPAIGN } from '@/interfaces';

const CampaignSetupPage: React.FC = () => {
  const router = useRouter();
  const { organization, setOrganization, setOrgMembers, setOrgCampaigns, setOrgDocuments, setOrgFAQs } = useOrganizationStore();
  const { setCampaign } = useCampaignStore();
  const { user } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organisationId = user?.organisations[1]?.id;

  useEffect(() => {
    if (organization.campaigns.length === 0 && organisationId) {
      const fetchCampaigns = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/organisations/${organisationId}/campaigns`);
          setOrgCampaigns(response.data);
        } catch (error) {
          console.error('Error fetching campaigns:', error);
          setError('Error fetching campaigns.');
        } finally {
          setLoading(false);
        }
      };

      fetchCampaigns();
    } else {
      setLoading(false);
    }
  }, [organisationId, organization.campaigns.length, setOrgCampaigns]);

  useEffect(() => {
    if (organisationId) {
      const fetchData = async () => {
        try {
          if (!organization?.documents || organization.documents.length === 0) {
            const documentsResponse = await apiClient.get(`/organisations/${organisationId}/documents`);
            setOrgDocuments(documentsResponse.data);
          }

          if (!organization?.faqs || organization.faqs.length === 0) {
            const faqsResponse = await apiClient.get(`/organisations/${organisationId}/faqs`);
            setOrgFAQs(faqsResponse.data);
          }

          if (!organization?.members || organization.members.length === 0) {
            const membersResponse = await apiClient.get(`/organisations/${organisationId}/members`);
            setOrgMembers(membersResponse.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data.');
        }
      };

      fetchData();
    }
  }, [organisationId, organization?.members, organization?.documents, organization?.faqs, setOrgMembers, setOrgDocuments, setOrgFAQs]);


  const handleNewCampaignClick = async () => {
    const initial_name = `New Campaign Template ${Date.now()}`
    try {
      const response = await apiClient.post(
        `/organisations/${organisationId}/campaigns/create`,
        {
          "auto_pilot": false,
          "document_ids": [],
          "email_tracking": false,
          "faq_ids": [],
          "link_tracking": false,
          "meeting_duration": 30,
          "name": initial_name,
          "test_mode": false,
          "user_ids": []
        }
      );
      const newCampaignId = response.data.id;

      const newCampaign = { ...INITIAL_CAMPAIGN, id: newCampaignId, name: initial_name };

      setCampaign(newCampaign);

      setOrganization({
        campaigns: [...organization.campaigns, newCampaign],
      });
      router.push('/campaign/setup');
    } catch (error) {
      console.error("Error creating new campaign:", error);
    }
  };


  const handleOpenCampaignClick = async (campaignId: number) => {
    try {
      const response = await apiClient.get(`/organisations/${organisationId}/campaigns/${campaignId}/detailed`);
      setCampaign(response.data);
      router.push('/campaign/setup');
    } catch (error) {
      console.error('Error fetching campaign:', error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
  }

  if (organization.campaigns.length === 0) {
    return (
      <div className="flex flex-col gap-6 w-[400px] pt-40 py-12 px-6 items-center text-center mx-auto">
        <Image src={CampaignIcon} alt="Bottom Graphic" width={120} height={132} />
        <span className="text-3xl font-bold leading-9 text-[#8C268C]">
          Start your first campaign
        </span>
        <Button
          width="134px"
          height="48px"
          color="DarkPink"
          text="Let's Go!"
          textColor="white"
          onClick={handleNewCampaignClick}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-50 overflow-y-auto">
      <div className="w-[950px] flex flex-col pt-16 mx-auto gap-12">
        <div className="flex flex-row justify-between">
          <span className="text-3xl font-bold text-[#8C268C]">All Campaigns</span>
          <Button
            width="150px"
            height="36px"
            color="DarkPink"
            icon={<FaPlus className="w-4 h-4" />}
            text="New Campaign"
            textSize="sm"
            textColor="white"
            padding="sm"
            onClick={handleNewCampaignClick}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {organization.campaigns.length && organization.campaigns.map((campaign, index) => {
            const features = {
              auto_pilot: campaign.auto_pilot,
              email_tracking: campaign.email_tracking,
              link_tracking: campaign.link_tracking,
            };
            return (
              <CampaignCard
                key={index}
                name={campaign.name}
                features={features}
                openCampaignClick={() => handleOpenCampaignClick(campaign.id || 0)}
              />
            );

          })}
        </div>
      </div>
    </div>
  );
};

export default CampaignSetupPage;
