import { CAMPAIGN_DOCUMENTS } from "@/common/endpoints";
import { DocumentObject } from "@/common/interfaces";
import apiClient from "@/services/apiClient";
import { create } from "zustand";

interface DocumentStore {
  campaignDocuments: DocumentObject[] | null;
  setCampaignDocuments: (value: DocumentObject[]) => void;
  loading: boolean;
  fetchCampaignDocuments: (organization_id: string, campaign_id: string) => Promise<void>;
}

const useDocumentsStore = create<DocumentStore>((set) => ({
  campaignDocuments: null,
  setCampaignDocuments: (value: DocumentObject[]) => set({ campaignDocuments: value }), // Corrected type here
  loading: false,
  fetchCampaignDocuments: async (organization_id: string, campaign_id: string) => {
    try {
      set({ loading: true });
      const response = await apiClient.get(CAMPAIGN_DOCUMENTS.replace("{organisation_id}", organization_id).replace("{campaign_id}", campaign_id))
      if (Array.isArray(response.data)) {
        set({ campaignDocuments: response.data });
      } else {
        console.error("Unexpected response format");
        set({ campaignDocuments: null });
      }
    } catch (error) {
      console.error("Error fetching Document data:", error);
      set({ campaignDocuments: null });
    } finally {
      set({ loading: false });
    }
  },

}));

export default useDocumentsStore;
