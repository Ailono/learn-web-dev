import { buildCalendarGrid } from "../data/date.js";
import DayCell from "./DayCell.jsx";

export default function CalendarGrid({
  year,
  month,
  today,
  selectedDay,
  onDayClick,
}) {
  const days = buildCalendarGrid(year, month).flat();

  return (
    <fieldset className="calendar__dates">
      <legend className="sr-only">Выберите дату визита</legend>
      <div className="calendar__grid">
        {days.map((day, index) => (
          <DayCell
            key={day === null ? `empty-${index}` : day}
            day={day}
            year={year}
            month={month}
            today={today}
            isSelected={day === selectedDay}
            onSelect={onDayClick}
          />
        ))}
      </div>
    </fieldset>
  );
}
