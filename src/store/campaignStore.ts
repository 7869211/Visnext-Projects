import {
  ICampaign,
  IDocument,
  ISequences,
  IFAQ,
  IMember,
  INITIAL_CAMPAIGN,
} from "@/interfaces";
import { create } from "zustand";

interface CampaignStore {
  campaignsList: ICampaign[];
  setCampaignsList: (campaigns: ICampaign[]) => void;
  campaign: ICampaign;
  setCampaign: (data: Partial<ICampaign>) => void;
  setMembers: (members: IMember[]) => void;
  setDocuments: (documents: IDocument[]) => void;
  setFAQs: (faqs: IFAQ[]) => void;
  addFAQ: (faq: IFAQ) => void;
  setEmails: (sequences: ISequences[]) => void;
  addEmail: (email: ISequences) => void;
}

const useCampaignStore = create<CampaignStore>((set) => ({
  campaignsList: [],
  setCampaignsList: (campaigns) => set({ campaignsList: campaigns }),
  campaign: INITIAL_CAMPAIGN,
  setCampaign: (data) =>
    set((state) => ({
      campaign: { ...state.campaign, ...data },
    })),
  setMembers: (members) =>
    set((state) => ({
      campaign: { ...state.campaign, members },
    })),
  setDocuments: (documents) =>
    set((state) => ({
      campaign: { ...state.campaign, documents },
    })),
  setFAQs: (faqs) =>
    set((state) => ({
      campaign: { ...state.campaign, faqs },
    })),
  addFAQ: (faq: IFAQ) =>
    set((state) => ({
      campaign: {
        ...state.campaign,
        faqs: [...state.campaign.faqs, { ...faq, id: Date.now() }],
      },
    })),
  setEmails: (sequences) =>
    set((state) => ({
      campaign: { ...state.campaign, sequences },
    })),
  addEmail: (email: ISequences) =>
    set((state) => ({
      campaign: {
        ...state.campaign,
        emails: [...state.campaign.sequences, { ...email, id: Date.now() }],
      },
    })),
}));

export default useCampaignStore;
