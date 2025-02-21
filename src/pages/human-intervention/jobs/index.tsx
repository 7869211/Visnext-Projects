import EmailThreadCard from "@/components/human-intervention/EmailThreadCard";
import IssueCard from "@/components/human-intervention/IssueCard";
import IssueReasonNotification from "@/components/human-intervention/IssueReasonNotification";
import JobsAccordionCard from "@/components/human-intervention/JobsAccordionCard";
import SearchBar from "@/components/human-intervention/SearchBar";
import React, { useState, useCallback, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { ContextualError, DropDownOption } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { calculateReadableDuration } from "@/lib/utils";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { ContactInfoCard } from "@/components/ui/ContactInfoCard";
import { AiSdrDetailsCard } from "@/components/ui/AiSdrDetailsCard";
import IssueFormComponent from "@/components/ui/IssueForm";
import Button from "@/components/ui/Button";
import { FaPlus } from "react-icons/fa6";
import { IoIosCheckmark } from "react-icons/io";
import Dropdown from "@/components/ui/DropDown";
import { formatTimestamp } from "@/lib/utils";
import {
  Chain,
  Interventions,
  JobObject,
  JobTypes,
  SuggestedJob,
} from "@/common/interfaces";
import { JobTitleKey } from "@/common/types";
import {
  ActionsDropdownOptionsHI,
  ActionsDropdownSubOptionsHI,
  jobTitles,
} from "@/common/constants";
import RaiseGitHubModal from "@/components/ui/RaiseGithubIssueModa";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import useDocumentsStore from "@/store/documentsStore";
import useUserStore from "@/store/userStore";
import { useSearchParams } from "next/navigation";

const IssueDetails = () => {
  const { user } = useUserStore();
  const [openItem, setOpenItem] = useState<number | null>(1);
  const [issueList, setIssueList] = useState<Interventions[]>([]);
  const [issueListBackup, setIssueListBackup] = useState<Interventions[]>([]);
  const {
    issueReasonsDetail,
    setIssueReasonsDetail,
    organizationId,
    setOrganizationId,
  } = useIssueReasonsStore();
  const { fetchCampaignDocuments } = useDocumentsStore();
  const [issueId, setIssueId] = useState<number>();
  const [doNotContact, setDoNotContactJob] = useState();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dropDownItemText, setDropItemText] = useState("Mark Status");
  const [currentOptions, setCurrentOptions] = useState(
    ActionsDropdownOptionsHI
  );
  const searchParams = useSearchParams();
  const [isSubmenu, setIsSubmenu] = useState(false);
  const [actionButtons, setActionButtons] = useState<JobTypes[]>();
  const [activeTab, setActiveTab] = useState("active");
  const [issueOverviewContactTab, setIssueOverviewContactTab] = useState(
    "HandleIssueOverview"
  );
  const [approveIssueStatus, setApproveIssueStatus] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");

  console.log(doNotContact);
  let orgId = -1;
  if (user && user.organisations.length > 0) {
    orgId = user.organisations[0].id;
  }
  const ORGANIZATION_ID = organizationId || orgId;

  const subOptionsWithBack: DropDownOption[] = [
    { label: "", value: "back" },
    ...ActionsDropdownSubOptionsHI,
  ];

  const toggleAccordion = (index: number, isAddMode?: boolean) => {
    if (isAddMode) {
      enableJobPosting(index);
    } else {
      setOpenItem(index === openItem ? null : index);
    }
  };

  const handleGithubFormSubmit = () => {
    setIsModalOpen(false);
  };
  const handleGithubFormClose = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (search: string) => {
    // console.log(search);
    const data = issueListBackup.filter((item) =>
      item.reasons[0].toLowerCase().includes(search.toLowerCase())
    );
    // console.log(data);
    setIssueList(data);
  };

  const handleSelect = (option: DropDownOption) => {
    if (option.value === "back") {
      setIsSubmenu(false);
      setCurrentOptions(ActionsDropdownOptionsHI);
      return;
    }

    if (option.value === "action2") {
      setIsSubmenu(true);
      setCurrentOptions(subOptionsWithBack);
      return;
    }
    if (isSubmenu) {
      setDropItemText(`Undelivered (${option.label})`);
      handleMarkUndeliveredJob(option.value || "unknown reason");
      setIsSubmenu(false);
      setCurrentOptions(ActionsDropdownOptionsHI);
      return;
    }

    if (option.label.trim() === "Mark as Do Not Contact") {
      setDropItemText("Do Not Contact");
      handleSetDoNotContactJob();
    }
    if (option.label.trim() === "Mark as Do Not Respond") {
      setDropItemText("Do Not Respond");
      handleSetDoNotContactJob();
    }
    if (option.label.trim() === "Mark to Handle Later") {
      setDropItemText("Handle later");
      handleMarkToLater();
    }
    if (option.label.trim() === "Approve") {
      setDropItemText(option.label);
      handleApproveAllJobs(issueId || -1);
    }
    if (option.label.trim() === "Resend to AI") {
      setDropItemText(option.label);
    }
    if (option.label.trim() === "Raise an issue in Github") {
      setIsModalOpen(true);
      setDropItemText(option.label);
    }
  };

  const keyMapOfJobsTypes: { [key in SuggestedJob["job_type"]]: string } = {
    REFERRAL: "contact_email",
    SEND_EMAIL: "email",
    SCHEDULE_FOLLOW_UP: "",
  };
  const getEmailField = (
    job: JobObject
  ): { to: string; subject: string; bodyText: string } | null => {
    const fieldName = keyMapOfJobsTypes[job.job_type];

    if (!fieldName || !job[fieldName]) {
      return null;
    }
    return {
      to: job[fieldName]?.to?.[0]?.address || "",
      subject: job[fieldName]?.subject || "",
      bodyText: job[fieldName]?.body?.text || "",
    };
  };

  const handleFetchCampaignDetails = useCallback(
    async (organisation_id: number, campaign_id: number) => {
      try {
        const response = await apiClient.get(
          `/organisations/${organisation_id}/campaigns/${campaign_id}/detailed`
        );
        if (response.status === 200) {
          setCampaignName(response.data?.name);
        }
      } catch (error) {
        const contextualError = error as ContextualError;
        try {
          setCampaignName('N/A');
          handleApiError(contextualError);
        } catch (handledError) {
          if (handledError instanceof Error) {
            showErrorToast(
              `Error in ${contextualError.context || "Unknown"}: ${
                handledError.message
              }`
            );
          } else {
            showErrorToast("An unexpected error occurred.");
          }
        }
      }
    },
    [organizationId]
  );

  const handleApproveAllJobs = useCallback(
    async (issueId: number) => {
      try {
        const response = await apiClient.post(
          `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/approve`
        );
        if (response.status === 200) {
          setApproveIssueStatus(true);
          showSuccessToast("All Jobs Approved Successfully");
        }
      } catch (error) {
        const contextualError = error as ContextualError;
        try {
          handleApiError(contextualError);
        } catch (handledError) {
          if (handledError instanceof Error) {
            showErrorToast(
              `Error in ${contextualError.context || "Unknown"}: ${
                handledError.message
              }`
            );
          } else {
            showErrorToast("An unexpected error occurred.");
            // console.log("An unexpected error occurred");
          }
        }
      }
    },
    [ORGANIZATION_ID]
  );

  const handleMarkUndeliveredJob = useCallback(
    async (jobReason: string) => {
      try {
        // console.log("job reason is:", jobReason);

        const response = await apiClient.post(
          `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/create/unsuccessful-delivery-job`,
          { reason: jobReason }
        );
        if (response.status === 200) {
          setDoNotContactJob(response.data);

          showSuccessToast("Job successfully marked as undelivered");
        }
      } catch (error) {
        const contextualError = error as ContextualError;
        try {
          handleApiError(contextualError);
        } catch (handledError) {
          if (handledError instanceof Error) {
            showErrorToast(
              `Error in ${contextualError.context || "Unknown"}: ${
                handledError.message
              }`
            );
          } else {
            showErrorToast("An unexpected error occurred.");
            // console.log("An unexpected error occurred");
          }
        }
      }
    },
    [issueId, ORGANIZATION_ID]
  );

  const handleMarkToLater = useCallback(async () => {
    try {
      const response = await apiClient.put(
        `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/handle-later`,
        { handle_later: true }
      );
      if (response.status === 200) {
        setDoNotContactJob(response.data);

        showSuccessToast("Issue marked to handle later successfully");
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(
            `Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`
          );
        } else {
          showErrorToast("An unexpected error occurred.");
          // console.log("An unexpected error occurred");
        }
      }
    }
  }, [issueId, ORGANIZATION_ID]);

  const handleSetDoNotContactJob = useCallback(async () => {
    try {
      const response = await apiClient.post(
        `/organisations/${ORGANIZATION_ID}/interventions/${issueId}/create/set-do-not-contact-job`
      );
      if (response.status === 200) {
        setDoNotContactJob(response.data);

        showSuccessToast("Successfully Marked as Do Not Contact");
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(
            `Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`
          );
        } else {
          showErrorToast("An unexpected error occurred.");
          // console.log("An unexpected error occurred");
        }
      }
    }
  }, [issueId, setDoNotContactJob, ORGANIZATION_ID]);

  const fetchIssuesReasons = useCallback(
    async (issue_id: number, orgId?: number) => {
      setIssueId(issue_id);
      try {
        const response = await apiClient.get(
          `/organisations/${orgId || ORGANIZATION_ID}/interventions/${issue_id}`
        );
        if (response.status === 200) {
          setIssueList((prev: Interventions[]) => {
            const updatedList = prev.map((item: Interventions) => {
              if (item.id === issue_id) {
                return { ...item, isActive: true };
              } else {
                return { ...item, isActive: false };
              }
            });
            return updatedList;
          });
          // setIssueReasons(response.data);
          setIssueReasonsDetail(response.data);
          fetchCampaignDocuments(
            ORGANIZATION_ID + "",
            response.data.request.context.campaign_id
          );
          // console.log("Success in fetching issue's reasons: ", response.data);
        }
      } catch (error) {
        const contextualError = error as ContextualError;
        try {
          handleApiError(contextualError);
        } catch (handledError) {
          if (handledError instanceof Error) {
            showErrorToast(
              `Error in ${contextualError.context || "Unknown"}: ${
                handledError.message
              }`
            );
          } else {
            showErrorToast("An unexpected error occurred.");
          }
        }
      }
    },
    [ORGANIZATION_ID, fetchCampaignDocuments, setIssueReasonsDetail]
  );
  // const fetchIssues = useCallback(async () => {
  //   try {
  //     const response = await apiClient.get(
  //       `/organisations/${ORGANIZATION_ID}/interventions-new`
  //     );
  //     if (response.status === 200) {
  //       if (response.data.length > 0) {
  //         const data = response.data.map((item: Interventions) => ({
  //           ...item,
  //           isActive: false,
  //         }));
  //         const id =
  //           activeTab === "active"
  //             ? response.data.filter(
  //                 (x: { handle_later: boolean }) => !x.handle_later
  //               )[0]?.id
  //             : response.data.filter(
  //                 (x: { handle_later: boolean }) => x.handle_later
  //               )[0]?.id;
  //         fetchIssuesReasons(id || response.data[0]?.id);

  //         setIssueList(data);
  //         setIssueListBackup(data);
  //         // console.log("Success in fetching data: ", data);
  //       } else {
  //         setIssueList([]);
  //         setIssueListBackup([]);
  //       }
  //     }
  //   } catch (error) {
  //     const contextualError = error as ContextualError;
  //     try {
  //       handleApiError(contextualError);
  //     } catch (handledError) {
  //       if (handledError instanceof Error) {
  //         showErrorToast(
  //           `Error in ${contextualError.context || "Unknown"}: ${
  //             handledError.message
  //           }`
  //         );
  //       } else {
  //         showErrorToast("An unexpected error occurred.");
  //         // console.log("An unexpected error occurred");
  //       }
  //     }
  //   }
  // }, [activeTab, fetchIssuesReasons, ORGANIZATION_ID]);
  const fetchIssues = useCallback(async () => {
    try {
      const interventionIssuesResponse = await apiClient.get(
        `/superuser/intervention-issues-new`
      );

      if (interventionIssuesResponse.status === 200) {
        const interventionIssuesData = interventionIssuesResponse.data;

        const allIssues = Object.values(interventionIssuesData).map(
          (orgData) => {
            const {
              organisation_name,
              issues,
              id: organisation_id,
            } = orgData as {
              organisation_name: string;
              issues: Interventions[];
              id: number;
            };

            const data = issues.map((item: Interventions) => ({
              ...item,
              organisation_name,
              organisation_id,
              isActive: false,
            }));

            return data;
          }
        );

        const flattenedIssues = allIssues.flat();

        setIssueList(flattenedIssues);
        setIssueListBackup(flattenedIssues);

        const issue =
          activeTab === "active"
            ? flattenedIssues.find((x: Interventions) => !x.handle_later)
            : flattenedIssues.find((x: Interventions) => x.handle_later);

        if (!issue) {
          showErrorToast(`No organization found for this first issue`);
          return;
        }
        setOrganizationId(issue?.organisation_id || -1);
        fetchIssuesReasons(
          issue?.id || flattenedIssues[0]?.id,
          issue?.organisation_id
        );
      } else {
        console.error("Failed to fetch issues.");
        setIssueList([]);
        setIssueListBackup([]);
      }
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(
            `Error in ${contextualError.context || "Unknown"}: ${
              handledError.message
            }`
          );
        } else {
          showErrorToast("An unexpected error occurred.");
        }
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const id = searchParams.get("id");
    setOrganizationId(id ? +id : ORGANIZATION_ID);
    if (id) {
      fetchIssues();
    }
  }, [searchParams, ORGANIZATION_ID, fetchIssues, setOrganizationId]);

  // const handleResetData = useCallback(async () => {
  //   try {
  //     const response = await apiClient.post("/organisations/reset-data");
  //     if (response.status === 200) {
  //       fetchIssues();
  //       showSuccessToast("Data Reset Successful!");
  //     }
  //   } catch (error) {
  //     const contextualError = error as ContextualError;
  //     try {
  //       handleApiError(contextualError);
  //     } catch (handledError) {
  //       if (handledError instanceof Error) {
  //         showErrorToast(
  //           `Error in ${contextualError.context || "Unknown"}: ${
  //             handledError.message
  //           }`
  //         );
  //       } else {
  //         showErrorToast("An unexpected error occurred.");
  //       }
  //     }
  //   }
  // }, [fetchIssues]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const emailChain =
    issueReasonsDetail?.request?.context?.email_chain?.chain || [];
  const sortedEmailChain = emailChain.sort((a: Chain, b: Chain) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0;
    }

    return dateB.getTime() - dateA.getTime();
  });

  const resetButtons = useCallback(() => {
    const jobsData = Object.entries(jobTitles).map(([, value]) => value);

    setActionButtons(
      jobsData.filter((item) => {
        return !issueReasonsDetail?.jobs.find((x) =>
          x.job.job_type.toLowerCase().includes(item.type.toLowerCase())
        );
      })
    );
  }, [issueReasonsDetail]);

  useEffect(() => {
    const campaignId = issueReasonsDetail?.request?.context?.campaign_id;
    if (!organizationId || !campaignId) return;

    handleFetchCampaignDetails(organizationId, campaignId);
    
    resetButtons();
  }, [organizationId,resetButtons, issueReasonsDetail?.request?.context?.campaign_id]);

  const enableJobPosting = (id: number) => {
    setActionButtons((prev) => {
      if (prev) {
        return prev.map((item) => {
          if (item.id === id) {
            item.isEnabled = !item.isEnabled;
          }
          return item;
        });
      }
    });
  };

  return (
    <>
      <div className="flex flex-wrap w-full pt-2 ">
        {/* Left Div */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-[#F0F1F3] bg-white h-screen overflow-y-auto">
          <div className="px-4 py-2 border-b border-[#f0f1f3] h-[61px]">
            <SearchBar handleSearch={handleSearch} />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h5 className="mb-2 text-[#30343E] text-base font-semibold">
                Issues List
              </h5>
              <p className="mb-2 text-[#858B9B] text-[14px] font-[400]">
                {activeTab === "active"
                  ? issueList.filter((x) => !x.handle_later)?.length
                  : issueList.filter((x) => x.handle_later)?.length}
                <span className="ml-1">Issues</span>
              </p>
            </div>
            <div className="flex justify-between items-center self-stretch">
              <div className="horizontal_tabs flex justify-between w-full items-center gap-2 p-1 rounded-lg border border-[#f2f4f7] bg-[#f7f8f9]">
                {/* Active Tab Button */}
                <div
                  onClick={() => setActiveTab("active")}
                  className={`w-[50%] flex justify-center items-center gap-2 py-1 px-3 rounded-md cursor-pointer ${
                    activeTab === "active"
                      ? "bg-white text-[#512652] font-semibold"
                      : "text-[#4a5468]"
                  }`}
                >
                  Active
                </div>

                {/* Handle Later Tab Button */}
                <div
                  onClick={() => setActiveTab("handleLater")}
                  className={`w-[50%] flex justify-center items-center gap-2 py-1 px-3 rounded-md cursor-pointer ${
                    activeTab === "handleLater"
                      ? "bg-white text-[#512652] font-semibold"
                      : "text-[#4a5468]"
                  }`}
                >
                  Handle Later
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="tabs-contents pt-4 ">
              {/* Active Tab Content */}
              {activeTab === "active" && (
                <div className="activeTab hover:cursor-pointer ">
                  {issueList?.length > 0 ? (
                    issueList?.map(
                      (item, index) =>
                        !item?.handle_later && ( //added to show only false status  issues
                          <IssueCard
                            key={index}
                            issueId={"ISSUE_" + `${item.id}`}
                            time={calculateReadableDuration(item.created_at)}
                            companyName={
                              item.organisation_name || "Unknown Organization"
                            }
                            interventionText={item.reasons[0]}
                            isActive={item.isActive || false}
                            onClick={() => {
                              fetchIssuesReasons(item.id, item.organisation_id);
                              setIssueId(item.id);
                              setOrganizationId(item.organisation_id || -1);
                            }}
                          />
                        )
                    )
                  ) : (
                    <p className="text-[#4a5468]">No Issue Found</p>
                  )}
                </div>
              )}

              {/* Handle Later Tab Content */}
              {activeTab === "handleLater" && (
                <div className="activeTab hover:cursor-pointer ">
                  {issueList?.length > 0 ? (
                    issueList?.map(
                      (item, index) =>
                        item?.handle_later && ( //added to show only false status  issues
                          <IssueCard
                            key={index}
                            issueId={"ISSUE_" + `${item.id}`}
                            time={calculateReadableDuration(item.created_at)}
                            companyName={
                              item.organisation_name || "Unknown Organization"
                            }
                            interventionText={item.reasons[0]}
                            isActive={item.isActive || false}
                            onClick={() => {
                              fetchIssuesReasons(item.id, item.organisation_id);
                              setIssueId(item.id);
                              setOrganizationId(item.organisation_id || -1);
                            }}
                          />
                        )
                    )
                  ) : (
                    <p className="text-[#4a5468]">No Issue Found</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Div */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white">
          <div className="px-4 py-2 border-b border-[#f0f1f3] h-[61px] flex items-center justify-between w-full">
            <div className="flex items-center">
              <p className="flex mb-0 items-center text-[18px] font-[600] text-[#8C268C] border-r border-[F0F1F3] pr-3">
                <span className="me-4 hover:cursor-pointer ">
                  {/* <Image src={BackArrowIcon} alt="back arrow icon" /> */}
                </span>
                Issue Details
              </p>
              {issueId && (
                <p className="border-[#8C268C] border rounded-[6px] px-[8px] py-[2px] ml-3 text-[#8C268C] text-[12px] font-[600]">
                  ISSUE-{issueId}
                </p>
              )}
            </div>
            <div>
              {/* reset icon  */}
              {/* <div onClick={handleResetData} className="hover:cursor-pointer">
                <Image src={RefreshIcon} alt="refresh icon" />
              </div> */}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center self-stretch px-4 py-2 border-b border-[#f0f1f3]">
              <div className="horizontal_tabs flex justify-between  items-center gap-2 p-1 rounded-lg border border-[#f2f4f7] bg-[#f7f8f9]">
                {/* Active Tab Button */}
                <div
                  onClick={() =>
                    setIssueOverviewContactTab("HandleIssueOverview")
                  }
                  className={`flex justify-center items-center gap-2 py-1 px-3 rounded-md cursor-pointer ${
                    issueOverviewContactTab === "HandleIssueOverview"
                      ? "bg-white text-[#512652] font-semibold"
                      : "text-[#4a5468]"
                  }`}
                >
                  Issue Overview
                </div>

                {/* Handle Later Tab Button */}
                <div
                  onClick={() => setIssueOverviewContactTab("handleContact")}
                  className={`flex justify-center items-center gap-2 py-1 px-3 rounded-md cursor-pointer ${
                    issueOverviewContactTab === "handleContact"
                      ? "bg-white text-[#512652] font-semibold"
                      : "text-[#4a5468]"
                  }`}
                >
                  Contact
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="tabs-contents ">
              <div className="activeTab ">
                <div className="flex flex-wrap w-full">
                  {/* Active Tab Content */}
                  {issueOverviewContactTab === "HandleIssueOverview" && (
                    <div className="w-full md:w-1/2 border-r border-[#F0F1F3]">
                      <div className="p-4 h-screen overflow-y-auto">
                        <div className="mb-5">
                          <h5 className="mb-3 text-[#30343E] text-base font-semibold">
                            Issue Reason
                          </h5>

                          {/* NEW CODE YOU CAN ADJUST IT ACCORDING TO YOUR CODE IN THIS CODE ONCLIKING THE NOTIFICATION ISSUE FORM SHOWS */}

                          {issueReasonsDetail &&
                          issueReasonsDetail.reasons[0] ? (
                            <div className="border border-[#CBD2E0] rounded-lg bg-white cursor-pointer">
                              <IssueReasonNotification
                                notification={
                                  issueReasonsDetail.reasons[0] || ""
                                }
                                icon={
                                  <AiOutlineExclamationCircle className="text-2xl text-[#8C268C]" />
                                }
                                onClose={() => {}}
                              />
                              {issueReasonsDetail.reasons[0]
                                .toLowerCase()
                                .includes("faqs") ||
                              issueReasonsDetail.reasons[0]
                                .toLowerCase()
                                .includes("documents") ? (
                                <IssueFormComponent
                                  issueReasons={issueReasonsDetail}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            <p className="text-[#4a5468]">No reason found!</p>
                          )}
                        </div>
                        <div className="mb-3">
                          <h5 className="mb-3 text-[#30343E] text-base font-semibold">
                            Email Thread
                          </h5>

                          {sortedEmailChain && sortedEmailChain.length ? (
                            sortedEmailChain.map((email, index) => (
                              <EmailThreadCard
                                key={index}
                                from={
                                  issueReasonsDetail?.request?.context
                                    ?.email_chain?.chain[index]?.from_
                                    ?.address || ""
                                }
                                to={
                                  issueReasonsDetail?.request?.context
                                    ?.email_chain?.chain[index]?.to[0]
                                    ?.address || ""
                                }
                                subject={
                                  issueReasonsDetail?.request?.context
                                    ?.email_chain?.chain[index]?.subject || ""
                                }
                                date={formatTimestamp(
                                  issueReasonsDetail?.request?.context
                                    ?.email_chain?.chain[index]?.date || ""
                                )}
                                body={
                                  issueReasonsDetail?.request?.context
                                    ?.email_chain?.chain[index]?.body?.html ||
                                  ""
                                }
                              />
                            ))
                          ) : (
                            <p className="text-[#4a5468]">No thread found!</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Handle Later Tab Content */}
                  {issueOverviewContactTab === "handleContact" && (
                    <div className="w-full md:w-1/2 border-r border-[#F0F1F3]">
                      {/* <div className="space-y-6 p-6"> */}
                      {issueReasonsDetail && (
                        <>
                          <ContactInfoCard
                            name={
                              issueReasonsDetail.request.contact.first_name +
                              " " +
                              issueReasonsDetail.request.contact.last_name
                            }
                            location={
                              issueReasonsDetail.request.contact.custom_data
                                .city +
                              " " +
                              issueReasonsDetail.request.contact.custom_data
                                .country
                            }
                            timeZone={
                              issueReasonsDetail.request.contact.timezone
                            }
                            email={issueReasonsDetail.request.contact.email}
                            company={
                              issueReasonsDetail.request.contact.custom_data
                                .company
                            }
                            jobTitle={
                              issueReasonsDetail.request.contact.custom_data
                                .title
                            }
                          />
                          {/* aisdr details are not present in api so for now i m exempted it */}
                          <AiSdrDetailsCard
                            name={
                              issueReasonsDetail?.request?.bot?.first_name +
                              " " +
                              issueReasonsDetail?.request?.bot?.last_name
                            }
                            email={issueReasonsDetail?.request?.bot?.email}
                            campaignName={campaignName}
                          />
                        </>
                      )}
                    </div>
                  )}
                  <div className="w-full md:w-1/2 ">
                    <div className="p-4 bg-white h-screen overflow-y-auto">
                      <div className="flex justify-between">
                        <h5 className="text-[#30343E] text-base font-semibold my-2">
                          Jobs
                        </h5>
                        <div className="flex gap-1">
                          <div className="flex items-center h-6 my-2 gap-2">
                            <span className="text-xs whitespace-nowrap text-[#555555]">
                              Handle Later
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                onClick={() => handleMarkToLater()}
                              />
                              <div className="w-8 h-5 bg-[#F1F5F9] border border-[#D5D7DE] rounded-full peer peer-checked:bg-[#F1F5F9] after:content-[''] after:absolute after:top-1 after:left-1 after:bg-[#A732A7] after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                            </label>
                          </div>

                          <div className="h-6">
                            <Button
                              color="White"
                              text="Resend to AI"
                              classes="focus:ring focus:ring-[#ffffff] font-sans font-medium text-xs leading-4 tracking-normal text-center h-10 w-[78px] whitespace-nowrap text-xs rounded-sm mb-2 text-[#555555] border border-[#CCCCCC]"
                            />
                          </div>
                          <div className="flex">
                            <div className="h-6">
                              <Button
                                color="White"
                                text={dropDownItemText}
                                classes="focus:ring focus:ring-[#ffffff] font-sans font-medium text-xs leading-4 tracking-normal text-center h-10 max-w-[100px] whitespace-wrap rounded-tl rounded-bl rounded-tr-none rounded-br-none mb-2 text-[#555555] border-t border-b border-l border-[#CCCCCC]"
                              />
                            </div>
                            <div className="mb-[2px] z-50">
                              <Dropdown
                                options={currentOptions}
                                onSelect={(option) => handleSelect(option)}
                              />
                            </div>
                          </div>
                          <div className="h-6">
                            <Button
                              onClick={() =>
                                handleApproveAllJobs(issueId || -1)
                              }
                              color="DarkPink"
                              text={
                                <span className="flex items-center justify-center mr-1">
                                  {approveIssueStatus && (
                                    <IoIosCheckmark className="text-white text-2xl" />
                                  )}
                                  Approve
                                </span>
                              }
                              classes="focus:ring focus:ring-[#ffffff] font-sans font-medium text-xs leading-4 tracking-normal text-center h-10 w-[80px] rounded-sm mb-2 text-white border-t border-b border-l border-[#CCCCCC] flex items-center justify-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="w-full mx-auto mt-2">
                        {issueReasonsDetail &&
                        issueReasonsDetail.jobs &&
                        issueReasonsDetail.jobs.length
                          ? issueReasonsDetail.jobs?.map((item, index) => {
                              let to = "";
                              let subject = "";
                              let bodyText = "";

                              if (item.job.email || item.job.contact_email) {
                                const emailData = getEmailField(item.job);

                                if (!emailData) {
                                  return null;
                                }
                                to = emailData.to;
                                subject = emailData.subject;
                                bodyText = emailData.bodyText;
                              }
                              return (
                                <>
                                  <JobsAccordionCard
                                    key={index}
                                    emailTitle={
                                      item.job.job_type as JobTitleKey
                                    }
                                    emailTo={to}
                                    emailSubject={subject}
                                    emailDesc={bodyText}
                                    id={issueId || -1}
                                    openItem={openItem}
                                    index={index}
                                    jobType={item}
                                    follow_up_date={item.last_updated}
                                    toggleAccordion={toggleAccordion}
                                  />
                                </>
                              );
                            })
                          : null}

                        {actionButtons
                          ?.filter((r) => r.isEnabled)
                          ?.map((job, index) => {
                            return (
                              <>
                                <div className="w-full mx-auto">
                                  <JobsAccordionCard
                                    key={index}
                                    emailTitle={job.key as JobTitleKey}
                                    emailTo={""}
                                    emailSubject={""}
                                    emailDesc={""}
                                    id={issueId || -1}
                                    openItem={openItem}
                                    follow_up_date={""}
                                    isEditMode={true}
                                    jobType={job || null}
                                    toggleAccordion={toggleAccordion}
                                  />
                                </div>
                              </>
                            );
                          })}
                      </div>
                      <div className="flex">
                        {actionButtons
                          ?.filter((r) => !r.isEnabled && r.isButton)
                          ?.map((job, index) => {
                            return (
                              <Button
                                key={index}
                                color="Pink"
                                icon={<FaPlus />}
                                text={job.title}
                                onClick={() => enableJobPosting(job.id)}
                                classes={
                                  "text-[#8C268C] text-xs rounded-tl rounded-bl rounded-tr rounded-br " +
                                  (index === 0 ? "" : "ml-4")
                                }
                              />
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <RaiseGitHubModal
          isOpen={isModalOpen}
          onSend={handleGithubFormSubmit}
          onClose={handleGithubFormClose}
        />
      )}
    </>
  );
};
export default IssueDetails;
