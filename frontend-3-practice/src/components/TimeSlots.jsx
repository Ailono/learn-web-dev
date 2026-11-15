import { DAYS_OF_WEEK_LOWER, MONTHS_GENITIVE } from "../data/date.js";

export default function TimeSlots({
  groups,
  selectedDate,
  selectedTime,
  onTimeClick,
}) {
  if (!selectedDate) {
    return (
      <div className="time-block">
        <div className="time-block__head">
          <h3 className="time-block__title">
            Свободное время
            <span className="time-block__date">Выберите дату</span>
          </h3>
          <p className="time-block__note">
            Зачёркнутые слоты заняты · время по Москве
          </p>
        </div>
        <p className="time-empty">
          Выберите дату в календаре, чтобы увидеть свободное время.
        </p>
      </div>
    );
  }

  const allSlots = groups.flatMap((group) => group.slots);
  const allBusy = allSlots.length > 0 && allSlots.every((slot) => slot.busy);

  return (
    <div className="time-block">
      <div className="time-block__head">
        <h3 className="time-block__title">
          Свободное время
          <span className="time-block__date">
            {selectedDate.getDate()}{" "}
            {MONTHS_GENITIVE[selectedDate.getMonth()]},{" "}
            {DAYS_OF_WEEK_LOWER[selectedDate.getDay()]}
          </span>
        </h3>
        <p className="time-block__note">
          Зачёркнутые слоты заняты · время по Москве
        </p>
      </div>

      <div className="time-slots" aria-live="polite">
        {allBusy ? (
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
                        slot.busy ? "time-slot--busy" : "",
                        isSelected ? "time-slot--selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      type="button"
                      key={slot.time}
                      aria-label={
                        slot.busy ? `${slot.time} — занято` : slot.time
                      }
                      aria-pressed={isSelected}
                      disabled={slot.busy}
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
