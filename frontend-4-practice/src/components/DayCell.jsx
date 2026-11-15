import {
  DAYS_OF_WEEK_SHORT,
  MONTHS_GENITIVE,
  compareDates,
  isDateSelectable,
} from "../data/date.js";

export default function DayCell({
  day,
  year,
  month,
  today,
  isSelected,
  onSelect,
}) {
  if (day === null) {
    return <span className="date-cell date-cell--empty" aria-hidden="true" />;
  }

  const date = new Date(year, month, day);
  const selectable = isDateSelectable(day, month, year, today);
  const isToday = compareDates(date, today) === 0;

  const classNames = ["date-cell"];
  if (!selectable) classNames.push("date-cell--disabled");
  if (isToday) classNames.push("date-cell--today");
  if (isSelected) classNames.push("date-cell--selected");

  const dateLabel = `${day} ${MONTHS_GENITIVE[month]}${
    selectable ? "" : ", недоступно"
  }`;

  return (
    <button
      className={classNames.join(" ")}
      type="button"
      aria-pressed={isSelected}
      disabled={!selectable}
      onClick={() => onSelect(day)}
    >
      <span className="date-cell__inner">
        <span className="date-cell__num">{day}</span>
        <span className="date-cell__meta">
          {DAYS_OF_WEEK_SHORT[date.getDay()]}
        </span>
      </span>
      <span className="sr-only">{dateLabel}</span>
    </button>
  );
}
