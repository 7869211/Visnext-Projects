import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const to24HourFormat = (time: string) => {
  // Split the time string into its components (e.g., "9:00 AM" -> ["9:00", "AM"])
  const [timePart, period] = time.split(" ");

  // Split the time component into hours and minutes (e.g., "9:00" -> ["9", "00"])
  const [hours, minutes] = timePart.split(":");

  // Convert hours to an integer
  let hoursNum = parseInt(hours);

  // Adjust hours based on whether it's AM or PM
  if (period.toUpperCase() === "PM" && hoursNum !== 12) {
    hoursNum += 12;
  } else if (period.toUpperCase() === "AM" && hoursNum === 12) {
    hoursNum = 0;
  }

  // Format hours and minutes to ensure two digits
  const hoursFormatted = hours.toString().padStart(2, "0");
  const minutesFormatted = minutes.padStart(2, "0");

  // Return the formatted time in HH:MM:SS format with seconds set to "00"
  return `${hoursFormatted}:${minutesFormatted}:00`;
};

export const clone = (data: unknown) => {
  return JSON.parse(JSON.stringify(data));
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    classNames: {
      toast: "sonner-toast-success",
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    classNames: {
      toast: "sonner-toast-error",
    },
  });
};

export const showWarningToast = (message: string) => {
  toast.warning(message, {
    classNames: {
      toast: "sonner-toast-warning",
    },
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    classNames: {
      toast: "",
    },
  });
};

export const calculateReadableDuration = (timestamp: string) => {
  const currentTime = new Date(); // Current date and time
  const targetTime = new Date(timestamp); // Parse the input timestamp

  const diffMilliseconds = Math.abs(
    currentTime.getTime() - targetTime.getTime()
  );

  const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24)); // Calculate full days
  const diffHours = Math.floor((diffMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Remaining hours
  const diffMinutes = Math.floor(
    (diffMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  ); // Remaining minutes

  let result = '';

  if (diffDays > 0) {
    result += `${diffDays}d `;
  }
  if (diffHours > 0 || diffDays > 0) { // Only show hours if there are days or hours
    result += `${diffHours}h `;
  }
  result += `${diffMinutes}m`;

  return result;
};


export const formatTimestamp = (input: string) => {
  const date = new Date(input);

  const formattedTimestamp =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    " " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0");

  return formattedTimestamp;
};

export const formatDateToYearMonthDD = (date: string) => {
  //"YYYY-MM-DD"
  return (
    new Date(date).setMonth(2) &&
    new Date(new Date(date).setMonth(2)).toISOString().split("T")[0]
  );
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = days[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Add suffix for the day
  let daySuffix;
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
    daySuffix = "st";
  } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
    daySuffix = "nd";
  } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
    daySuffix = "rd";
  } else {
    daySuffix = "th";
  }

  return `${dayOfWeek}, ${dayOfMonth}${daySuffix} ${month} ${year}`;
};

export const convertTo24HourFormat = (time: string) => {
  if (time) {
    const [hours, minutes] = time.match(/(\d{1,2}):(\d{2})/)?.slice(1) || [];
    const periodMatch = time.match(/(AM|PM)/);
    const period = periodMatch ? periodMatch[0] : "";
    let hoursR = hours;
    hoursR =
      period === "PM" && hours !== "12"
        ? (parseInt(hours, 10) + 12).toString()
        : hours;
    hoursR = period === "AM" && hours === "12" ? "00" : hours;

    return `${hoursR.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  }
  return "";
};

export const convertStringWithoutDash = (input: string) => {
  if (!input) {
    return "";
  }
  let result = input.toLowerCase().replace(/_/g, " ");

  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
};
export const getTimeInHHmm = (dateStr: string) => {
  if (!dateStr) {
    return "";
  }
  const date = new Date(dateStr);

  // Get hours and minutes
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format minutes to always be two digits
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
};
