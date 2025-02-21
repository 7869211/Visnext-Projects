import React, { useState } from 'react';

import ActionBar from '@/components/ui/campaign/ActionBar';
import DataList from '@/components/ui/campaign/DataList';
import useCampaignStore from '@/store/campaignStore';
import useOrganizationStore from '@/store/organizationStore';
import apiClient from '@/services/apiClient';
import useUserStore from '@/store/userStore';

const DocumentsPage: React.FC = () => {
  const [direction, setDirection] = useState<'row' | 'col'>('row');
  const { campaign, setDocuments } = useCampaignStore();
  const { organization, setOrgDocuments } = useOrganizationStore();
  const { user } = useUserStore();

  const organisationId = user?.organisations[1]?.id;

  const toggleSelectAll = () => {
    const allSelected =
      organization?.documents.length > 0 &&
      organization?.documents.every((orgDoc) =>
        campaign.documents.some((campDoc) => campDoc.id === orgDoc.id)
      );

    if (allSelected) {
      setDocuments([]);
    } else {
      setDocuments(organization?.documents || []);
    }
  };

  const toggleSelection = async (id: number) => {
    const existingDocument = campaign.documents.find((doc) => doc.id === id);
  
    try {
      if (existingDocument) {
        const response = await apiClient.delete(
          `/organisations/${organisationId}/campaigns/${campaign.id}/documents/${id}`
        );
        
        if (response.status === 200) {
          const updatedDocuments = campaign.documents.filter((doc) => doc.id !== id);
          setDocuments(updatedDocuments);
        }
      } else {
        const newDocument = organization.documents.find((doc) => doc.id === id);
        
        if (newDocument) {
          const response = await apiClient.post(
            `/organisations/${organisationId}/campaigns/${campaign.id}/documents/add`,
            { id: newDocument.id }
          );
          
          if (response.status === 200) {
            const updatedDocuments = [...campaign.documents, newDocument];
            setDocuments(updatedDocuments);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling document selection:", error);
    }
  };
  

  const handleSave = async (id: number, updatedDescription: string) => {
        try {
      await apiClient.put(
        `/organisations/${organisationId}/documents/${id}/description`,
        { description: updatedDescription }
      );

      const updatedDocuments = campaign?.documents.map((doc) =>
        doc.id === id ? { ...doc, description: updatedDescription } : doc
      );
      setDocuments(updatedDocuments);

      const updatedOrganizationDocuments = organization?.documents.map((doc) =>
        doc.id === id ? { ...doc, description: updatedDescription } : doc
      );
      setOrgDocuments(updatedOrganizationDocuments);
    } catch (error) {
      console.error("Failed to update document description:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/organisations/${organisationId}/documents/${id}`);
  
      const updatedCampaignDocuments = campaign?.documents.filter((doc) => doc.id !== id);
      const updatedOrgDocuments = organization?.documents.filter((doc) => doc.id !== id);
  
      setDocuments(updatedCampaignDocuments || []);
      setOrgDocuments(updatedOrgDocuments || []);
  
      console.log("Document deleted successfully.");
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  return (
    <div className="space-y-6">
      <ActionBar
        selectedCount={campaign?.documents.length}
        totalDocs={organization?.documents.length}
        onSelectAll={toggleSelectAll}
        direction={direction}
        onChangeDirection={setDirection}
      />
      <DataList
        items={organization?.documents}
        selectedDocs={new Set(campaign.documents.map((doc) => doc.id))}
        onToggleSelect={(id) => toggleSelection(id)}
        direction={direction}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DocumentsPage;
