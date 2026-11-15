import { DAYS_OF_WEEK_LOWER, MONTHS_GENITIVE } from "../data/date.js";
import { groupSlots, hasAvailableSlots } from "../data/slots.js";

export default function TimeSlots({
  slots,
  selectedDate,
  selectedTime,
  isLoading,
  error,
  onTimeClick,
  onRetry,
}) {
  const header = (
    <div className="time-block__head">
      <h3 className="time-block__title">
        Свободное время
        <span className="time-block__date">
          {selectedDate
            ? `${selectedDate.getDate()} ${
                MONTHS_GENITIVE[selectedDate.getMonth()]
              }, ${DAYS_OF_WEEK_LOWER[selectedDate.getDay()]}`
            : "Выберите дату"}
        </span>
      </h3>
      <p className="time-block__note">
        Зачёркнутые слоты заняты · время по Москве
      </p>
    </div>
  );

  if (!selectedDate) {
    return (
      <div className="time-block">
        {header}
        <p className="time-empty">
          Выберите дату в календаре, чтобы увидеть свободное время.
        </p>
      </div>
    );
  }

  const groups = groupSlots(slots);

  return (
    <div className="time-block">
      {header}

      <div className="time-slots" aria-live="polite" aria-busy={isLoading}>
        {isLoading ? (
          <p className="time-empty time-empty--loading">
            <span className="loading-spinner" aria-hidden="true" />
            Загрузка слотов…
          </p>
        ) : error ? (
          <div className="time-error">
            <p className="time-error__text">{error}</p>
            <button className="state-box__button" type="button" onClick={onRetry}>
              Повторить
            </button>
          </div>
        ) : !hasAvailableSlots(slots) ? (
          <p className="time-empty">
            На этот день свободных слотов не осталось. Выберите другую дату.
          </p>
        ) : (
          groups.map((group) => (
            <fieldset className="time-group" key={group.title}>
              <legend className="time-group__title">{group.title}</legend>
              <div className="time-group__grid">
                {group.slots.map((slot) => {
                  const isSelected = slot.time === selectedTime;

                  return (
                    <button
                      className={[
                        "time-slot",
                        slot.available ? "" : "time-slot--busy",
                        isSelected ? "time-slot--selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      type="button"
                      key={slot.time}
                      aria-label={
                        slot.available ? slot.time : `${slot.time} — занято`
                      }
                      aria-pressed={isSelected}
                      disabled={!slot.available}
                      onClick={() => onTimeClick(slot.time)}
                    >
                      <span className="time-slot__box">{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))
        )}
      </div>
    </div>
  );
}
