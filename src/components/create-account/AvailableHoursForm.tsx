import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import Image from "next/image";
import {
  CREATE_ACCOUNT_FORMS_DETAIL,
  DAY_HOURS_DATA,
  DEFAULT_INTERVAL,
  WEEK_DAYS_DATA,
} from "@/common/constants";
import Button from "@/components/ui/Button";
import InputWithDropdown from "@/components/ui/InputWithDropdown";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import NextHourArrow from "@/assets/images/next-hour-arrow.svg";
import {
  AvailableHours,
  ContextualError,
  HoursInterval,
  WeekDays,
} from "@/interfaces";
import { clone, to24HourFormat } from "@/lib/utils";
import { useRegistrationStore } from "@/store/useRegistrationStore";
import apiClient from "@/services/apiClient";
import { UPDATE_USER_AVAILABILITY } from "@/common/endpoints";
import useUserStore from "@/store/userStore";
import { handleApiError } from "@/lib/errorHandler";
import { showErrorToast } from "@/lib/utils";
const AvailableHoursForm: React.FC = () => {
  const { fetchUserData } = useUserStore();
  const [weekData, setWeekData] = useState(WEEK_DAYS_DATA);
  const { currentStep, setCurrentStep, submitForm, setSubmitForm } =
    useRegistrationStore();
  const [isAllSameAsMondayHours, setIsAllSameAsMondayHours] = useState(false);

  const handleInterval = (index: number) => {
    setWeekData((prev) => {
      const newWeekData = clone(prev);
      const subInterval = {
        ...clone(DEFAULT_INTERVAL),
        subInterval: true,
      };
      newWeekData[index].hoursInterval = [
        ...(newWeekData[index].hoursInterval || []),
        clone(subInterval),
      ];
      return newWeekData;
    });
    if (isAllSameAsMondayHours) {
      handleToggle(true, -4);
    }
  };

  const setHour = (
    value: string,
    index: number,
    intervalIndex: number,
    from: "start" | "end"
  ) => {
    setWeekData((prev) => {
      const newWeekData = clone(prev);
      newWeekData[index].hoursInterval[intervalIndex][from] = clone(value);
      return newWeekData;
    });
    if (isAllSameAsMondayHours) {
      handleToggle(true, -4);
    }
  };

  const handleToggle = (enabled: boolean, index: number) => {
    setWeekData((prev) => {
      const newWeekData = prev.map((t, i) => {
        if (index === -4) {
          if (enabled) {
            prev[0].isEditable = true;
            prev[0].isActive = true;
          }
          if (t.isActive && enabled) {
            t.hoursInterval = clone(prev[0].hoursInterval);
          }
          t.isEditable = !enabled || i === 0;
        } else if (i === index) {
          t.isActive = enabled;
        }
        return t;
      });
      return newWeekData;
    });

    if (index === -4) {
      setIsAllSameAsMondayHours(enabled);
    }
  };

  const convertToAvailableHours = (data: WeekDays[]) => {
    const result: AvailableHours[] = [];

    data.forEach(
      (day: {
        isActive: boolean;
        hoursInterval: HoursInterval[];
        name: string;
      }) => {
        if (day.isActive) {
          day.hoursInterval.forEach(
            (interval: { start: string; end: string }) => {
              result.push({
                day: day.name.toLowerCase(),
                start: to24HourFormat(interval.start),
                end: to24HourFormat(interval.end),
              });
            }
          );
        }
      }
    );

    return result;
  };

  const submit = useCallback(async () => {
    const data = convertToAvailableHours(weekData);
    if (!data) {
      console.log("Please enable at least one day.");
      setSubmitForm(false);
      return;
    }

    try {
      await apiClient.put(UPDATE_USER_AVAILABILITY, data);
      console.log("Availability hours setup successfully!");

      setCurrentStep(
        Math.min(currentStep + 1, CREATE_ACCOUNT_FORMS_DETAIL.length - 1)
      );
      setSubmitForm(false);
      await fetchUserData();
    } catch (error) {
      const contextualError = error as ContextualError;
      try {
        handleApiError(contextualError);
      } catch (handledError) {
        setSubmitForm(false);
        if (handledError instanceof Error) {
          showErrorToast( `Error in ${contextualError.context || "Unknown"}: ${
            handledError.message
          }`);
        } else {
          showErrorToast("An unexpected error occurred.");
        }
      }
    }
  }, [weekData, setCurrentStep, currentStep, setSubmitForm, fetchUserData]);

  useEffect(() => {
    if (submitForm) {
      submit();
    }
  }, [submitForm, submit]);

  return (
    <>
      <div className="border-2 bg-[#521252] border-[#611C61] p-3 rounded-xl mb-4 mt-7">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="mb-3 font-medium">
              Set all the same as Monday’s hours
            </h4>
            <p className="mb-0 text-[#F8E9F8] font-light text-sm">
              Tip: Turn on to set all first, then turn off to customize
              individually.
            </p>
          </div>
          <div>
            <ToggleSwitch
              enabled={isAllSameAsMondayHours}
              onToggle={(value) => handleToggle(value, -4)}
            />
          </div>
        </div>
      </div>
      <div className="h-[48vh] overflow-auto">
        {weekData.map((item, index) => (
          <div
            key={item.key}
            className="py-3 border-b-[1px] border-[#400c40] last:border-none px-1"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center me-7 w-[94px]">
                  <ToggleSwitch
                    enabled={item.isActive}
                    onToggle={(value) => handleToggle(value, index)}
                  />
                  <span
                    className={`ms-3 ${!item.isActive ? "text-[#908693]" : ""}`}
                  >
                    {item.key}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.hoursInterval
                    .filter((interval) => !interval.subInterval)
                    .map((interval, intervalIndex) => (
                      <div key={intervalIndex} className="flex items-center">
                        <div className="w-[110px]">
                          {item.isEditable && item.isActive ? (
                            <InputWithDropdown
                              placeholder="0:00AM"
                              value={interval.start}
                              options={DAY_HOURS_DATA}
                              mode="dark"
                              height="48px"
                              onSelect={(value) =>
                                setHour(value, index, intervalIndex, "start")
                              }
                            />
                          ) : (
                            <div
                              className={`flex items-center h-[48px] ${
                                !item.isActive ? "text-[#908693]" : ""
                              }`}
                            >
                              {interval.start}
                            </div>
                          )}
                        </div>
                        <div
                          className={`mx-2 ${
                            !item.isActive ? "text-[#908693]" : ""
                          }`}
                        >
                          -
                        </div>
                        <div className="w-[110px]">
                          {item.isEditable && item.isActive ? (
                            <InputWithDropdown
                              placeholder="0:00AM"
                              value={interval.end}
                              options={DAY_HOURS_DATA}
                              mode="dark"
                              height="48px"
                              onSelect={(value) =>
                                setHour(value, index, intervalIndex, "end")
                              }
                            />
                          ) : (
                            <div
                              className={`flex items-center h-[48px] ${
                                !item.isActive ? "text-[#908693]" : ""
                              }`}
                            >
                              {interval.end}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {item.isActive && item.isEditable && (
                <div>
                  <Button
                    width="48px"
                    height="48px"
                    color="DarkPink"
                    icon={<FaPlus className="w-5 h-5" />}
                    text=""
                    textSize="sm"
                    textColor="white"
                    padding="sm"
                    classes="!rounded-full"
                    onClick={() => handleInterval(index)}
                  />
                </div>
              )}
            </div>
            {item.hoursInterval
              .filter((subInterval) => subInterval.subInterval)
              .map((subInterval, subIndex) => (
                <div key={subIndex} className="mt-4 flex">
                  <div className="flex items-center">
                    <div className="w-[94px] me-7">
                      <div className="">
                        <Image
                          src={NextHourArrow}
                          alt="Next hours arrow"
                          className="ms-auto"
                          width={28}
                          height={28}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[110px]">
                        {item.isEditable && item.isActive ? (
                          <InputWithDropdown
                            placeholder="0:00AM"
                            value={subInterval.start}
                            options={DAY_HOURS_DATA}
                            mode="dark"
                            height="48px"
                            onSelect={(value) =>
                              setHour(value, index, subIndex, "start")
                            }
                          />
                        ) : (
                          <div className="flex items-center h-[48px]">
                            {subInterval.start}
                          </div>
                        )}
                      </div>
                      <div className="mx-2">-</div>
                      <div className="w-[110px]">
                        {item.isEditable && item.isActive ? (
                          <InputWithDropdown
                            placeholder="0:00AM"
                            value={subInterval.end}
                            options={DAY_HOURS_DATA}
                            mode="dark"
                            height="48px"
                            onSelect={(value) =>
                              setHour(value, index, subIndex, "end")
                            }
                          />
                        ) : (
                          <div className="flex items-center h-[48px]">
                            {subInterval.end}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default AvailableHoursForm;
