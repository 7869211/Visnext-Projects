import { Interventions, JobRes } from "../interfaces";

export const updateIssueReasonsDetailJobs = (issueReasonsDetail: Interventions | null, responseData: JobRes) => {
    return {
      ...issueReasonsDetail,
      jobs: [
        ...(issueReasonsDetail?.jobs || []), 
        {
          id: responseData.id,
          human_intervention_id: responseData?.human_intervention_id,
          job: responseData.job,
          last_updated: responseData?.last_updated,
        }
      ],
    };
  };
  
  export const convertDateData = (dataOne: string[]) => {
    const convertTo12HourFormat = (timeString: string | number | Date) => {
      const date = new Date(timeString);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
  
      hours = hours % 12;
      hours = hours ? hours : 12; 
      // minutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

      return `${hours}:${formattedMinutes} ${ampm}`;
    };
  
    const dataTwo = dataOne.map((timeRange: string) => {
      // Ensure the value is a string before splitting
      if (typeof timeRange === "string") {
        const [startTime, endTime] = timeRange.split(" - ");
        const formattedStartTime = convertTo12HourFormat(startTime);
        const formattedEndTime = convertTo12HourFormat(endTime);
  
        return {
          time: `${formattedStartTime} - ${formattedEndTime}`,
          isSelected: false,
        };
      }
      // Return default value if not a string
      return { time: "", isSelected: false };
    });
  
    return dataTwo;
  };


 export const removeJobFromDetail = (issueReasonsDetail: Interventions | null, jobIdToRemove: number) => {
    if (!issueReasonsDetail) return issueReasonsDetail;
  
    const updatedJobs = issueReasonsDetail.jobs.filter(
      (job) => job.id !== jobIdToRemove
    );
  
    return {
      ...issueReasonsDetail,
      jobs: updatedJobs,
    };
  };