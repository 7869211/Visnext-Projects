import React, { useState, useCallback } from "react";
import { LuUsers,LuChevronDown } from "react-icons/lu";
import { MdOutlineAlarm, MdOutlineCalendarMonth } from "react-icons/md";
import Button from "./Button";
import Input from "./Input";
import { MeetingDetails } from "@/interfaces";
import apiClient from "@/services/apiClient";
import {
  convertTo24HourFormat,
  showErrorToast,
  showSuccessToast,
} from "@/lib/utils";
import { ContextualError } from "@/interfaces";
import { handleApiError } from "@/lib/errorHandler";
import DatePickerComponent from "./DatePickerComponent";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./DropdownMenu";
import useIssueReasonsStore from "@/store/issueReasonsStore";
import { Interventions, User } from "@/common/interfaces";
import {
  convertDateData,
  updateIssueReasonsDetailJobs,
} from "@/common/helpers";

interface EditMeetingJobFormProps {
  initialMeetingDetails?: Partial<MeetingDetails>;
  onSave?: (details: MeetingDetails) => void;
  onCancel?: () => void;
  issueId: number | null;
  isAddForm: boolean;
}

const EditMeetingJobForm: React.FC<EditMeetingJobFormProps> = ({
  initialMeetingDetails = {},
  onSave,
  onCancel,
  isAddForm,
  issueId,
}) => {
  const [isOpenSelectUsersDropDown, setIsOpenSelectUsersDropDown] =
    useState(false);
  const [availability, setAvailability] = useState<
    {
      time: string;
      isSelected: boolean;
    }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  // const [isOpenAttendeesDropDown, setIsOpenAttendeesDropDown] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails>({
    meetingDate: initialMeetingDetails.meetingDate || "",
    startTime: initialMeetingDetails.startTime || "",
    endTime: initialMeetingDetails.endTime || "",
    selectedUsers: initialMeetingDetails.selectedUsers || [],
    allMeetingAttendees: initialMeetingDetails.allMeetingAttendees || [],
  });
  const [inputValue, setInputValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [startDate, setStartDate] = useState(new Date());
  const toggleSelectUsersDropDown = () =>
    setIsOpenSelectUsersDropDown(!isOpenSelectUsersDropDown);
  // const toggleAttendeesDropDown = () =>
  //   setIsOpenAttendeesDropDown(!isOpenAttendeesDropDown);
  const { issueReasonsDetail, setIssueReasonsDetail, organizationId } = useIssueReasonsStore();
  const [users] = useState<User[]>(issueReasonsDetail?.request?.users || []);

  const handleSlotSelection = (slot: { time: string }) => {
    const [startTime, endTime] = slot.time.split(" - ");
    setMeetingDetails((prev) => ({
      ...prev,
      startTime,
      endTime,
    }));
  };

  const handleChange = (
    field: keyof MeetingDetails,
    value: string | string[]
  ) => {
    setMeetingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = useCallback(async () => {
    const { meetingDate, startTime, endTime, allMeetingAttendees } =
      meetingDetails;

    if (!meetingDate.trim()) {
      showErrorToast("Meeting Date is required!");
      return;
    }
    if (!startTime.trim()) {
      showErrorToast("Start Time is required!");
      return;
    }
    if (!endTime.trim()) {
      showErrorToast("End Time is required!");
      return;
    }

    try {
      const formattedStart = `${meetingDate}T${convertTo24HourFormat(
        startTime
      )}`;
      const formattedEnd = `${meetingDate}T${convertTo24HourFormat(endTime)}`;

      const payload = {
        attendees: allMeetingAttendees.map((email) => {
          const user = users.find((user) => email.includes(user.email));
          return {
            address: email,
            name: user ? user?.first_name + " " + user?.last_name : "Unknown",
          };
        }),
        start: formattedStart,
        end: formattedEnd,
        iana_timezone: "Europe/London",
        user_id: 0,
      };
      const response = await apiClient.post(
        `/organisations/${organizationId}/interventions/${issueId}/create/create-event-job`,
        payload
      );

      if (response.status === 200) {
        showSuccessToast("Meeting job created successfully!");
        const updatedData = updateIssueReasonsDetailJobs(
          issueReasonsDetail,
          response.data
        ) as Interventions;
        setIssueReasonsDetail(updatedData);
        if (onSave) {
          onSave(meetingDetails);
        }
      }
    } catch (error) {
      try {
        handleApiError(error as ContextualError);
      } catch (handledError) {
        if (handledError instanceof Error) {
          showErrorToast(handledError.message);
        } else {
          showErrorToast("An unexpected error occurred.");
          console.error("Unexpected error:", error);
        }
      }
    }
  }, [
    issueId,
    meetingDetails,
    onSave,
    users,
    issueReasonsDetail,
    setIssueReasonsDetail,
    organizationId
  ]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const fetchCalendarAvailability = async (date: Date, userId: number) => {
    if(!meetingDetails.meetingDate) {
      showErrorToast("Please select a date to fetch availability.");
      return;
    }
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGFzZWxhYnMiLCJzdWIiOiIyMjAiLCJleHAiOjE3MzgwNjY3ODEsImlhdCI6MTczNzk4MDM4MSwianRpIjoiZDJiNWU3NjE4MTJmNGU3MmE3ZDZmMTAwY2QzMzY1ZmQiLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiY29udGV4dCI6eyJ1c2VyX2lkIjoyMjAsImlzX3N1cGVydXNlciI6ZmFsc2UsIm9yZ2FuaXNhdGlvbnMiOlt7InJvbGUiOiJhZG1pbiIsIm9yZ2FuaXNhdGlvbl9pZCI6NDN9XX19.17R-K7z9CCg-xiGWq314pBojqlDvM22JR9qBwGAZ6s4";
      const payload = {
        start: meetingDetails.meetingDate,
        end: meetingDetails.meetingDate,
        // end: (() => {
        //   const startDate = new Date(meetingDetails.meetingDate);
        //   startDate.setDate(startDate.getDate() + 1);
        //   return startDate.toISOString().split("T")[0];
        // })(),
      };
      // const data = convertDateData([
      //   "2025-01-01T08:00:00+00:00 - 2025-01-01T16:00:00+00:00",
      //   "2025-01-02T10:00:00+00:00 - 2025-01-02T10:45:00+00:00",
      //   "2025-01-02T11:30:00+00:00 - 2025-01-02T14:00:00+00:00",
      //   "2025-01-02T14:30:00+00:00 - 2025-01-02T16:00:00+00:00",
      //   "2025-01-03T08:30:00+00:00 - 2025-01-03T09:45:00+00:00",
      //   "2025-01-03T10:00:00+00:00 - 2025-01-03T11:30:00+00:00",
      //   "2025-01-03T12:00:00+00:00 - 2025-01-03T13:00:00+00:00",
      //   "2025-01-03T14:00:00+00:00 - 2025-01-03T15:30:00+00:00",
      //   "2025-01-03T16:30:00+00:00 - 2025-01-03T17:30:00+00:00",
      //   "2025-01-06T08:00:00+00:00 - 2025-01-06T16:30:00+00:00",
      //   "2025-01-07T08:30:00+00:00 - 2025-01-07T10:00:00+00:00",
      //   "2025-01-07T10:30:00+00:00 - 2025-01-07T16:30:00+00:00",
      // ]);
      // setAvailability(data);
      // console.log("end date", payload);
      const response = await apiClient.get(
        `/organisations/${organizationId}/members/${userId}/calendar-availability`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: payload,
        }
      );

      if (response.status === 200) {
        // showSuccessToast("Calendar availability fetched successfully!");
        // console.log("Calendar Availability:", convertDateData(response.data));
        setAvailability(convertDateData(response.data));
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
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredUsers(
      value
        ? users.filter(
            (user) =>
              `${user.first_name} ${user.last_name}`.toLowerCase().includes(value.toLowerCase()) ||
              user.email.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const handleSelectRecipient = (recipient:User) => {
    if (!meetingDetails.allMeetingAttendees.includes(recipient.email)) {
      handleChange("allMeetingAttendees", [...meetingDetails.allMeetingAttendees, recipient.email]);
    }
    setInputValue("");
    setFilteredUsers([]);
  };

  const handleAddManualEntry = () => {
    if (inputValue.trim() && !meetingDetails.allMeetingAttendees.includes(inputValue.trim())) {
      handleChange("allMeetingAttendees", [...meetingDetails.allMeetingAttendees, inputValue.trim()]);
    }
    setInputValue("");
    setFilteredUsers([]);
  };
  console.log("meetingdetails.sekected",users)
  return (
    <div className="w-full p-4 md:p-4 lg:p-4 bg-white shadow rounded-lg">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <MdOutlineCalendarMonth className="w-5 h-5 text-[#8C268C]" />
          <h2 className="text-sm font-semibold text-[#512652]">
            {isAddForm ? "Create" : "Edit"} Meeting Job
          </h2>
        </div>
        <p className="text-gray-400 text-xs mt-1">
          Your AI SDR will book this meeting with the contact from the users
          calendar.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Select Users</label>
        <div className="flex items-center ">
          <Input
            type="text"
            value={meetingDetails.selectedUsers
              .map(email => {
                const user = users.find(u => u.email === email);
                return user ? `${user.first_name} ${user.last_name}` : email;
              })
              .join(", ")
            }
          
            onChange={(value) =>
              
              handleChange("selectedUsers", value.split(", "))
            }
            placeholder="Select user for the meeting"
            customStyles="!text-sm !text-[#BABEC8] border-gray-100 border-2 !rounded-tl !rounded-bl !rounded-tr-none !rounded-br-none w-full !h-[32px] "
          />

          <DropdownMenu>
            <DropdownMenuTrigger onClick={toggleSelectUsersDropDown}>
              <div className="w-[35px] h-[32px] flex justify-center items-center  border-r-2 border-t-2 border-b-2 border-gray-100 rounded-br-md rounded-tr-md">
                <LuChevronDown className=" text-[#8C268C]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              isOpen={isOpenSelectUsersDropDown}
              onClose={() => setIsOpenSelectUsersDropDown(false)}
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <DropdownMenuItem
                    key={user.id}
                    onClick={() => {
                      handleChange("selectedUsers", user.email.split(", "));
                      setMeetingDetails((prev) => ({
                        ...prev,
                        selectedUsers: [...prev.selectedUsers],
                      }));
                      setSelectedUserId(user.id);
                    }}
                  >
                    {user.first_name} {user.last_name}{" "}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No users available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex flex-col md:flex-row gap-2 items-start w-full overflow-hidden">
          <div className="flex-1 flex-shrink-0">
            <label className="block text-sm text-[#575D6D] mb-1.5">
              Select Meeting Date
            </label>
            <span>
              <DatePickerComponent
                selectedDate={startDate}
                onDateChange={(date) => {
                  date = date || new Date();
                  setStartDate(date);
                  setMeetingDetails((prev) => ({
                    ...prev,
                    meetingDate: date.toISOString().split("T")[0],
                  }));

                  if (selectedUserId) {
                    fetchCalendarAvailability(date, selectedUserId);
                  } else {
                    showErrorToast(
                      "Please select a user to fetch availability."
                    );
                  }
                }}
              />
            </span>
          </div>

          <div className="flex-1 flex-shrink-0">
            <label className="block text-sm text-[#575D6D] mb-1.5 whitespace-nowrap">
              Available Time Slots
            </label>
            <div className="space-y-2 border border-[#D5D7DE] rounded-sm w-full overflow-hidden">
              <p className="text-sm text-[#512652] font-bold mt-[18px] ml-3">
                {startDate.toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[220px] p-1">
                {availability?.length ? availability.map(
                  (
                    slot: { time: string, isSelected: boolean; },
                    index: React.Key | null | undefined
                  ) => (
                    <button
                      key={index}
                      className={`flex items-center justify-between px-3 py-2 border rounded text-sm hover:bg-[#F8E9F8] w-full`}
                      onClick={() => handleSlotSelection(slot)}
                    >
                      <div className="flex items-center gap-1">
                        <MdOutlineAlarm className="w-6 h-6 text-[#8C268C] ml-[-4px]" />
                        <span className="text-[#575D6D] hover:text-[#8C268C]">
                          {slot.time}
                        </span>
                      </div>
                    </button>
                  )
                ) : <p className="flex items-center text-[#512652] text-[13px] m-auto">No Availability found</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Start Time</label>
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={meetingDetails.startTime}
                onChange={(value) => handleChange("startTime", value)}
                placeholder="Enter start time"
                customStyles="border-gray-100 border-2 w-full"
              />
              <div className="h-[58px] w-[100px] flex justify-center items-center border-2 border-gray-100 rounded-md">
                <MdOutlineAlarm className="w-5 h-5 text-[#8C268C]" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-600">End Time</label>
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={meetingDetails.endTime}
                onChange={(value) => handleChange("endTime", value)}
                placeholder="Enter end time"
                customStyles="border-gray-100 border-2 w-full"
              />
              <div className="h-[58px] w-[100px] flex justify-center items-center border-2 border-gray-100 rounded-md">
                <MdOutlineAlarm className="w-5 h-5 text-[#8C268C]" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
      <label className="block text-sm text-gray-600">All Attendees</label>
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-2 border-2 border-gray-100 rounded-md p-2 min-h-[48px] w-full">
          {meetingDetails.allMeetingAttendees.map((email, index) => (
            <div key={index} className="flex items-center bg-[#F8E9F8] px-2 py-0.5 rounded min-w-fit">
              <span className="text-[#8C268C] text-xs whitespace-nowrap">{email}</span>
              <button
                onClick={() =>
                  handleChange(
                    "allMeetingAttendees",
                    meetingDetails.allMeetingAttendees.filter((_, i) => i !== index)
                  )
                }
                className="ml-1 text-gray-800"
              >
                ✕
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleAddManualEntry()}
            className="outline-none flex-grow min-w-[150px]"
            // placeholder="Type an email or name"
          />
        </div>
        <div className="w-[48px] h-[48px] flex justify-center items-center border-2 border-gray-100 rounded-md">
          <LuUsers className="w-4 h-4 text-[#8C268C]" />
        </div>
      </div>
      {filteredUsers.length > 0 && (
        <div className="mt-2 border border-gray-200 rounded-md bg-white shadow-md max-h-40 overflow-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectRecipient(user)}
            >
              {user.first_name} {user.last_name}
            </div>
          ))}
        </div>
      )}
    </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-3 pt-8">
        <Button
          color="Gray"
          text="Cancel"
          onClick={handleCancel}
          classes="h-12 w-full md:w-1/2 bg-[#F8E9F8] text-[#8C268C] text-sm !z-10"
        />
        <Button
          color="DarkPink"
          text="Save Changes"
          onClick={handleSave}
          classes="h-12 w-full md:w-1/2 text-sm text-white !z-10"
        />
      </div>
    </div>
  );
};

export default EditMeetingJobForm;
