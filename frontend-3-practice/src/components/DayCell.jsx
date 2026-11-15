import {
  DAYS_OF_WEEK_LOWER,
  MONTHS_GENITIVE,
  compareDates,
  isDateSelectable,
} from "../data/date.js";
import { formatFreeSlots, getFreeSlotsCount } from "../data/slots.js";

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
  const freeCount = getFreeSlotsCount(year, month, day);
  const metaText = formatFreeSlots(freeCount);

  const classNames = ["date-cell"];
  if (!selectable) classNames.push("date-cell--disabled");
  if (isToday) classNames.push("date-cell--today");
  if (isSelected) classNames.push("date-cell--selected");

  const metaClassNames = ["date-cell__meta"];
  if (freeCount > 0 && freeCount <= 3) {
    metaClassNames.push("date-cell__meta--low");
  }

  const weekday = DAYS_OF_WEEK_LOWER[date.getDay()];
  const dateLabel = `${weekday}, ${day} ${MONTHS_GENITIVE[month]}${
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
        <span className={metaClassNames.join(" ")}>{metaText}</span>
      </span>
      <span className="sr-only">{dateLabel}</span>
    </button>
  );
}
