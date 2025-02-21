import { STATIC_ORGANIZATION_ID } from "@/common/constants";
import { Interventions } from "@/common/interfaces";
import { create } from "zustand";

interface IssueReasonStore {
  issueReasonsDetail: Interventions | null;
  setIssueReasonsDetail: (campaigns: Interventions) => void;
  organizationId: number;
  setOrganizationId: (id: number) => void;
}

const useIssueReasonsStore = create<IssueReasonStore>((set) => ({
  issueReasonsDetail: null,
  setIssueReasonsDetail: (issueReason) => set({ issueReasonsDetail: issueReason }),
  organizationId: STATIC_ORGANIZATION_ID,
  setOrganizationId: (id) => set({ organizationId: id }),

}));

export default useIssueReasonsStore;
