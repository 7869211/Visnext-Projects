import React from 'react';

import Input from '@/components/ui/Input';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import useCampaignStore from '@/store/campaignStore';
import useUserStore from '@/store/userStore';
import apiClient from '@/services/apiClient';
import useOrganizationStore from '@/store/organizationStore';

const CampaignPage: React.FC = () => {
  const { updateOrgCampaign } = useOrganizationStore();
  const { campaign, setCampaign } = useCampaignStore();
  const { name, email_tracking, auto_pilot, link_tracking } = campaign;

  const { user } = useUserStore();

  const organisationId = user?.organisations[1]?.id;
  const campaignId = campaign?.id;

  const updateTracking = async (key: string, value: boolean) => {
    if (!organisationId || !campaignId) {
      console.error("Missing organisation or campaign ID.");
      return;
    }

    try {
      let endpoint = '';

      if (key === 'email_tracking') {
        endpoint = `/organisations/${organisationId}/campaigns/${campaignId}/update-tracking`;
      } else if (key === 'link_tracking') {
        endpoint = `/organisations/${organisationId}/campaigns/${campaignId}/update-link-tracking`;
      } else if (key === 'auto_pilot') {
        endpoint = `/organisations/${organisationId}/campaigns/${campaignId}/update-auto-intervention`;
      }

      if (!endpoint) return;

      await apiClient.put(endpoint, { [key === "auto_pilot" ? "auto_pilot" : "enable_tracking"]: value });

      console.log(`${key} updated successfully to ${value}`);
      setCampaign({ [key]: value });
      updateOrgCampaign(campaignId, { [key]: value });
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
    }
  };

  const toggleFeatures = [
    {
      label: 'Track Email Open Rate',
      description:
        'Use open rate tracking technology to track when contacts open campaign emails.',
      enabled: email_tracking,
      onToggle: (value: boolean) => updateTracking('email_tracking', value),
    },
    {
      label: 'Enable Auto-Pilot',
      description:
        'Our AI will send responses and take action without approval.',
      enabled: auto_pilot,
      onToggle: (value: boolean) => updateTracking('auto_pilot', value),
    },
    {
      label: 'Track Link Click Rate',
      description:
        'Use link click tracking technology to track when contacts click through on links in campaigns.',
      enabled: link_tracking,
      onToggle: (value: boolean) => updateTracking('link_tracking', value),
    },
  ];

  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-[#1D2026]">Let’s start your first campaign.</h1>
        <p className="text-lg leading-7 text-[#2D3648]">
          What are your goals for your first campaign?
        </p>
      </div>
      <div className="flex flex-col gap-9">
        <Input label="CAMPAIGN NAME" value={name} onChange={(value) => setCampaign({ name: value })} />
        <div className="grid grid-cols-3 gap-6">
          {toggleFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col px-4 py-3 gap-2 bg-white border rounded-lg z-30"
            >
              <div className="flex flex-row justify-between items-center">
                <span className="text-xs text-[#30343E] font-medium leading-4">
                  {feature.label}
                </span>
                <ToggleSwitch
                  enabled={feature.enabled}
                  onToggle={feature.onToggle}
                  mode="pink"
                />
              </div>
              <p className="text-xs text-[#575D6D] font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
