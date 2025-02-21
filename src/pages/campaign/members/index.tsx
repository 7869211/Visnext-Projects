import React from 'react';
import CircleCheckBox from '@/components/ui/CircleCheckBox';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import PendingIcon from "@/assets/images/member-pending-status.svg";
import ConnectedIcon from "@/assets/images/member-connected-status.svg"
import Image from 'next/image';
import useCampaignStore from '@/store/campaignStore';
import useOrganizationStore from '@/store/organizationStore';
import { IMember } from '@/interfaces';
import apiClient from '@/services/apiClient';
import useUserStore from '@/store/userStore';

const MembersPage: React.FC = () => {
  const { campaign, setMembers } = useCampaignStore();
  const { organization } = useOrganizationStore();
  const { user } = useUserStore();

  const organisationId = user?.organisations[1]?.id;

  const toggleMemberSelection = async (id: number) => {
    const memberOnOrg = organization?.members.find((member) => member.id === id);
   
    const campaignId = campaign?.id;
  
    if (!organisationId || !campaignId) {
      console.error("Organization or Campaign ID is missing.");
      return;
    }
  
    const isSelected = campaign?.members.some((campaignMember) => campaignMember.id === id);
  
    try {
      if (isSelected) {
        await apiClient.delete(
          `/organisations/${organisationId}/campaigns/${campaignId}/members/${id}`
        );
  
        const updatedCampaignMembers: IMember[] = campaign.members.filter(
          (campaignMember) => campaignMember.id !== id
        );
        setMembers(updatedCampaignMembers);
      } else {
        await apiClient.post(
          `/organisations/${organisationId}/campaigns/${campaignId}/members/add`,
          { id: id }
        );
  
        const updatedCampaignMembers = [...campaign.members, memberOnOrg!];
        setMembers(updatedCampaignMembers);
      }
    } catch (error) {
      console.error(
        `Failed to ${isSelected ? "remove" : "add"} member with ID ${id}:`,
        error
      );
    }
  };
  
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold text-[#1D2026]">Add some humans.</h1>
        <p className="text-lg leading-7 text-[#2D3648]">
          These members will receive calendar invites and be able to manage any questions AI can’t answer.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {organization?.members.map((member) => {
          const isSelected = campaign?.members.some((campaignMember) => campaignMember.id === member.id);

          return (
            <div
              key={member.id}
              className={`flex flex-row h-[50px] rounded-lg px-5 items-center gap-3 justify-between ${isSelected ? 'bg-[#F8E9F8] text-[#8C268C]' : 'text-[#575D6D]'
                }`}
            >
              <CircleCheckBox
                selected={isSelected}
                onToggle={() => toggleMemberSelection(member.id)}
              />
              <div className="flex flex-row gap-2 items-center w-[300px]">
                <span className="text-base font-normal">{member.email}</span>
              </div>
              <span className="text-base font-normal w-[300px]">
                {member.first_name + ' ' + member.last_name}
              </span>
              <span className="flex gap-[10px] text-xs font-medium w-[100px]">
                {member.valid_oauth ? (
                  <Image src={ConnectedIcon} alt="Member Icon" width={16} height={16} />
                ) : (
                  <Image src={PendingIcon} alt="Member Icon" width={16} height={16} />
                )}
                {member.valid_oauth ? "Connected" : "Pending"}
              </span>
              <div className="flex flex-row items-center gap-3">
                <div className="flex bg-white w-[60px] h-[26px] rounded-3xl text-[10px] items-center text-center justify-center">
                  {member.role}
                </div>
                <IoEllipsisVerticalSharp className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersPage;
