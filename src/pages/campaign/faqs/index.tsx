import React, { useState } from 'react';

import ActionBar from '@/components/ui/campaign/ActionBar';
import DataList from '@/components/ui/campaign/DataList';
import useCampaignStore from '@/store/campaignStore';
import useOrganizationStore from '@/store/organizationStore';
import apiClient from '@/services/apiClient';
import useUserStore from '@/store/userStore';

const FAQPage: React.FC = () => {
    const [direction, setDirection] = useState<'row' | 'col'>('col');
    const { organization, setOrgFAQs } = useOrganizationStore();
    const { campaign, setFAQs } = useCampaignStore();
    const { user } = useUserStore();

    const organisationId = user?.organisations[1]?.id;

    const toggleSelectAll = () => {
        const allSelected =
          organization?.faqs.length > 0 &&
          organization?.faqs.every((orgFAQ) =>
            campaign.faqs.some((campFAQ) => campFAQ.id === orgFAQ.id)
          );
    
        if (allSelected) {
          setFAQs([]);
        } else {
            setFAQs(organization?.faqs || []);
        }
      };

      const toggleSelection = async (id: number) => {
        const existingFAQ = campaign.faqs.find((faq) => faq.id === id);
      
        try {
          if (existingFAQ) {
            const response = await apiClient.delete(
              `/organisations/${organisationId}/campaigns/${campaign.id}/faqs/${id}`
            );
      
            if (response.status === 200) {
              const updatedFAQs = campaign.faqs.filter((faq) => faq.id !== id);
              setFAQs(updatedFAQs);
            }
          } else {
            const newFAQ = organization.faqs.find((faq) => faq.id === id);
      
            if (newFAQ) {
              const response = await apiClient.post(
                `/organisations/${organisationId}/campaigns/${campaign.id}/faqs/add`,
                { id: newFAQ.id }
              );
      
              if (response.status === 200) {
                const updatedFAQs = [...campaign.faqs, newFAQ];
                setFAQs(updatedFAQs);
              }
            }
          }
        } catch (error) {
          console.error("Error toggling FAQ selection:", error);
        }
      };
      

    const handleSave = async (id: number, updatedDescription: string, updatedTitle?: string) => {
    
        try {
          await apiClient.put(
            `/organisations/${organisationId}/faqs/${id}`,
            { 
                question: updatedTitle,
                answer: updatedDescription
            }
          );
    
          const updatedFAQs = campaign?.faqs.map((faq) =>
            faq.id === id ? { ...faq, description: updatedDescription } : faq
          );
          setFAQs(updatedFAQs);
    
          const updatedOrganizationFAQs = organization?.faqs.map((faq) =>
            faq.id === id ? { ...faq, description: updatedDescription } : faq
          );
          setOrgFAQs(updatedOrganizationFAQs);
        } catch (error) {
          console.error("Failed to update document description:", error);
        }
      };

    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/organisations/${organisationId}/faqs/${id}`);
        
            const updatedCampaignFAQs = campaign?.faqs.filter((faq) => faq.id !== id);
            const updatedOrgFAQs = organization?.faqs.filter((faq) => faq.id !== id);
        
            setFAQs(updatedCampaignFAQs || []);
            setOrgFAQs(updatedOrgFAQs || []);
        
            console.log("Document deleted successfully.");
          } catch (error) {
            console.error("Failed to delete document:", error);
          }
    };

    return (
        <div className="space-y-6">
            <ActionBar
                selectedCount={campaign?.faqs.length}
                totalDocs={organization?.faqs.length}
                onSelectAll={toggleSelectAll}
                direction={direction}
                onChangeDirection={setDirection}
            />
            <DataList
                items={organization?.faqs}
                selectedDocs={new Set(campaign.faqs.map((doc) => doc.id))}
                onToggleSelect={(id) => toggleSelection(id)}
                direction={direction}
                onSave={handleSave}
                onDelete={handleDelete}
                type='faq'
            />
        </div>
    );
};

export default FAQPage;
