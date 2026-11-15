import CalendarHeader from "./CalendarHeader.jsx";
import CalendarGrid from "./CalendarGrid.jsx";
import TimeSlots from "./TimeSlots.jsx";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const LEGEND_ITEMS = [
  { label: "Свободно", modifier: "" },
  { label: "Выбрано", modifier: "legend-item__swatch--selected" },
  { label: "Недоступно", modifier: "legend-item__swatch--disabled" },
];

export default function CalendarCard({
  currentYear,
  currentMonth,
  today,
  selectedDay,
  selectedTime,
  slots,
  selectedDate,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onTimeClick,
}) {
  return (
    <section className="calendar-card" aria-labelledby="calendar-title">
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />

      <div className="calendar__weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <CalendarGrid
        year={currentYear}
        month={currentMonth}
        today={today}
        selectedDay={selectedDay}
        onDayClick={onDayClick}
      />

      <div className="calendar__legend">
        {LEGEND_ITEMS.map((item) => (
          <span className="legend-item" key={item.label}>
            <span
              className={["legend-item__swatch", item.modifier]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>

      <div className="calendar__divider" />

      <TimeSlots
        groups={slots}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTimeClick={onTimeClick}
      />
    </section>
  );
}
