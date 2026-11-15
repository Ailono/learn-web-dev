import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../data/date.js";

export default function BookingBottomBar({ selectedDate, selectedTime }) {
  const dateLabel = selectedDate
    ? `${DAYS_OF_WEEK[selectedDate.getDay()]}, ${selectedDate.getDate()} ${
        MONTHS_GENITIVE[selectedDate.getMonth()]
      } ${selectedDate.getFullYear()}`
    : "Дата не выбрана";
  const timeLabel = selectedTime || "время не выбрано";

  return (
    <div className="booking-footer">
      <div className="booking-footer__price">
        <span className="booking-footer__label">Итого</span>
        <span className="booking-footer__sum">
          2 500 ₽ <span className="booking-footer__duration">· 60 минут</span>
        </span>
      </div>

      <div className="booking-footer__selection">
        <span className="booking-footer__label">Вы выбрали</span>
        <p
          className={[
            "booking-footer__selected",
            selectedTime ? "" : "booking-footer__selected--empty",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-live="polite"
        >
          {dateLabel} · {timeLabel}
        </p>
      </div>

      <button
        className="btn btn--primary"
        type="button"
        disabled={!selectedTime}
      >
        Продолжить
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
