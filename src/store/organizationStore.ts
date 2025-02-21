import { IDocument, IFAQ, IMember, ICampaign } from "@/interfaces";
import { create } from "zustand";

interface IOrganization {
  name: string;
  documents: IDocument[];
  faqs: IFAQ[];
  members: IMember[];
  campaigns: ICampaign[];
}

interface OrganizationStore {
  organization: IOrganization;
  setOrganization: (data: Partial<IOrganization>) => void;
  setOrgDocuments: (documents: IDocument[]) => void;
  addOrgDocument: (document: IDocument) => void;
  setOrgFAQs: (faqs: IFAQ[]) => void;
  addOrgFAQs: (faq: IFAQ) => void;
  setOrgMembers: (members: IMember[]) => void;
  addMember: (member: IMember) => void;
  setOrgCampaigns: (campaigns: ICampaign[]) => void;
  addOrgCampaign: (campaign: ICampaign) => void;
  updateOrgCampaign: (id: number, updates: Partial<ICampaign>) => void;
  deleteOrgCampaign: (id: number) => void;
}

const useOrganizationStore = create<OrganizationStore>((set) => ({
  organization: {
    name: "Organization",
    documents: [],
    faqs: [],
    members: [],
    campaigns: [],
  },

  setOrganization: (data) =>
    set((state) => ({
      organization: {
        ...state.organization,
        ...data,
      },
    })),
  setOrgDocuments: (documents) =>
    set((state) => ({
      organization: { ...state.organization, documents },
    })),
  addOrgDocument: (document) =>
    set((state) => ({
      organization: {
        ...state.organization,
        documents: [
          ...state.organization.documents,
          { ...document, id: Date.now() },
        ],
      },
    })),
  setOrgFAQs: (faqs) =>
    set((state) => ({
      organization: { ...state.organization, faqs },
    })),
  addOrgFAQs: (faq) =>
    set((state) => ({
      organization: {
        ...state.organization,
        faqs: [...state.organization.faqs, { ...faq, id: Date.now() }],
      },
    })),
  setOrgMembers: (members) =>
    set((state) => ({
      organization: { ...state.organization, members },
    })),
  addMember: (member) =>
    set((state) => ({
      organization: {
        ...state.organization,
        members: [...state.organization.members, { ...member, id: Date.now() }],
      },
    })),
  setOrgCampaigns: (campaigns) =>
    set((state) => ({
      organization: { ...state.organization, campaigns },
    })),
  addOrgCampaign: (campaign) =>
    set((state) => ({
      organization: {
        ...state.organization,
        campaigns: [
          ...state.organization.campaigns,
          { ...campaign, id: Date.now() },
        ],
      },
    })),
  updateOrgCampaign: (id, updates) =>
    set((state) => ({
      organization: {
        ...state.organization,
        campaigns: state.organization.campaigns.map((campaign) =>
          campaign.id === id ? { ...campaign, ...updates } : campaign
        ),
      },
    })),
  deleteOrgCampaign: (id) =>
    set((state) => ({
      organization: {
        ...state.organization,
        campaigns: state.organization.campaigns.filter(
          (campaign) => campaign.id !== id
        ),
      },
    })),
}));

export default useOrganizationStore;
