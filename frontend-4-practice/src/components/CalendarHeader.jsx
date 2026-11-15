import { MONTHS_NOMINATIVE } from "../data/date.js";

export default function CalendarHeader({ month, year, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar__top">
      <div className="calendar__heading">
        <h2 className="calendar__title" id="calendar-title">
          Выберите дату
        </h2>
        <p className="calendar__subtitle">
          Выберите удобный день — время подгрузим с сервера
        </p>
      </div>

      <div className="month-switch">
        <button
          className="icon-btn"
          type="button"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m14.5 5-7 7 7 7" />
          </svg>
        </button>
        <span className="month-switch__label" aria-live="polite">
          {MONTHS_NOMINATIVE[month]} {year}
        </span>
        <button
          className="icon-btn"
          type="button"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9.5 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
