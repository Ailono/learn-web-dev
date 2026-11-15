export default function CalendarState({ loading = false, error = null, onRetry }) {
  return (
    <section className="calendar-card" aria-labelledby="calendar-title">
      <div className="calendar__top">
        <div className="calendar__heading">
          <h2 className="calendar__title" id="calendar-title">
            Выберите дату
          </h2>
        </div>
      </div>

      <div
        className={
          error ? "calendar-state calendar-state--error" : "calendar-state"
        }
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner" aria-hidden="true" />
            <p className="calendar-state__text">Загрузка…</p>
          </>
        ) : (
          <>
            <p className="calendar-state__title">
              Не удалось загрузить календарь
            </p>
            <p className="calendar-state__text">{error}</p>
            <button
              className="state-box__button"
              type="button"
              onClick={onRetry}
            >
              Повторить
            </button>
          </>
        )}
      </div>
    </section>
  );
}
