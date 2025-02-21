"use client";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CircleCheckBox from "@/components/ui/CircleCheckBox";
import { LuSearch } from "react-icons/lu";
import { formatDateToYearMonthDD, showErrorToast } from "@/lib/utils";
import { DocumentObject } from "@/common/interfaces";
import useDocumentsStore from "@/store/documentsStore";

interface FilePickerModal {
  isOpen?: boolean;
  onClose?: () => void;
  onSend?: (data: DocumentObject[]) => void;
}
export default function FilePickerModal({
  isOpen,
  onClose,
  onSend,
}: FilePickerModal) {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const { campaignDocuments } = useDocumentsStore();
  const [documents, setDocuments] = useState<DocumentObject[]>(campaignDocuments || []);
  // const { user } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDocuments = documents?.filter((item) => item.isSelected);
    if (!selectedDocuments || selectedDocuments.length === 0) {
      showErrorToast("Please select at least one document");
      return;
    }
    onSend?.(selectedDocuments);
    onClose?.();
  };
  const handleClose = () => {
    onClose?.();
  };

  // const getDocuments = useCallback(async (organisation_id: number) => {
  //   setError("");
  //   const campaign_id =issueReasons?.request ? issueReasons?.request?.context.campaign_id : 0;

  //   try {
  //     const response = await apiClient.get(
  //       `/organisations/${organisation_id}/documents`
  //     );
  //     if (response.status === 200) {
  //       if (response.data.length === 0) {
  //         setError("No data found");
  //       }
  //       if (response.data.length > 0) {
  //         const data = response.data.map((item: DocumentObject) => ({
  //           ...item,
  //           isSelected: false,
  //         }));
  //         setDocuments(data);
  //         setBackupDocuments(data);
  //       }

  //      //  console.log("Success in fetching documents data: ", response.data);
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
  //        //  console.log("An unexpected error occurred");
  //       }
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (user && user.organisations.length > 0) {
  //     getDocuments(user.organisations[0].id);
  //   }
  // }, [getDocuments , user]);

  const searchDocument =  useCallback(async (search: string) => {
    setError("");
    if (campaignDocuments && campaignDocuments?.length > 0) {
      const filteredData = campaignDocuments.filter((item) =>
        item.filename.toLowerCase().includes(search.toLowerCase())
      );
      if (filteredData.length === 0) {
        setError("No data found");
      }
      setDocuments(filteredData);
    }
  }, [campaignDocuments]);

  useEffect(() => {
    searchDocument(search);
  }, [search, searchDocument]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-[600px] max-h-[100vh] h-[42rem] border border-blue-200">
            <div className="flex justify-between items-center p-4 border-gray-100">
              <h2 className="text-lg font-semibold text-[#742574]">
                Selected Attachment
              </h2>
              <Dialog.Close asChild>
                <button className="text-gray-500 hover:text-gray-700">
                  <X onClick={handleClose} className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
            <div className="px-4 overflow-auto h-[38rem]">
              <div className="Searchbar ">
                <button className=" relative top-9 left-3 font-[20px]">
                  <LuSearch className="searchbar text-[#8C268C] text-xl" />
                </button>
                <input
                  className="pl-10 py-2 w-full border text-[14px] rounded-lg text-[#4A5468]"
                  type="text"
                  placeholder="Search Files"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {documents
                ? documents.map((item, index) => (
                    <div
                      key={index}
                      className={` my-5 rounded-xl py-3 ${
                        item.isSelected ? "bg-[#F8E9F8]" : ""
                      }`}
                    >
                      <div className="flex justify-between pt-1 w-full">
                        <div className="flex">
                          <CircleCheckBox
                            selected={item.isSelected || false}
                            onToggle={() =>
                              setDocuments((prev) => {
                                if (prev === undefined) return prev;
                                const newDocuments = [...prev];
                                newDocuments[index].isSelected =
                                  !newDocuments[index].isSelected;

                                return newDocuments;
                              })
                            }
                            isDarkMode={false}
                            classes="!h-[1.3rem] !w-[1.3rem] mt-2 ml-4"
                          />
                          <h3 className=" ml-3 py-2 text-[#512652] text-[16px]">
                            {item.filename}
                          </h3>
                        </div>
                        <span className="text-[12px] pr-8 text-[#858B9B]">
                          {formatDateToYearMonthDD(item.last_updated)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-[12px] px-5">
                        {item.description}
                      </p>
                    </div>
                  ))
                : !error && (
                    <p className="text-[12px] px-5 py-5 text-[#858B9B]">
                      loading...
                    </p>
                  )}
              {error && (
                <p className=" text-[12px] px-5 py-5 text-[#858B9B]">{error}</p>
              )}

              <div className="flex gap-4 my-5">
                <button className="w-full text-center py-3 px-0  text-sm rounded-lg font-semibold text-[#8C268C] bg-[#F8E9F8]">
                  Cancel
                </button>
                <button
                  className="w-full text-center py-3 px-0 text-sm rounded-lg font-semibold bg-[#8C268C] text-white"
                  onClick={handleSubmit}
                >
                  Add Attachments
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
