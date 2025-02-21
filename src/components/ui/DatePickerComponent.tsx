import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerComponentProps {
  selectedDate: Date;
  onDateChange: (date: Date | null) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selectedDate,
  onDateChange,
}) => {
  return (
    <DatePicker
      inline
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            <div className="mr-[2px] ml-2 w-8 h-8 border border-[#DDDEE0] rounded-lg flex justify-center items-center">
              <ChevronLeft className="text-[#8C268C]" />
            </div>
          </button>
          <span className="mt-3 text-[#512652] text-sm font-bold mb-3">
            {date.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            <div className="mr-2 w-8 h-8 border border-[#DDDEE0] rounded-lg flex justify-center items-center">
              <ChevronRight className="text-[#8C268C]" />
            </div>
          </button>
        </div>
      )}
      selected={selectedDate}
      onChange={onDateChange}
    />
  );
};

export default DatePickerComponent;
