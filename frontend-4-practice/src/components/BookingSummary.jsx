export default function BookingSummary() {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 className="summary__title" id="summary-title">
        Ваша запись
      </h2>

      <div className="summary__service">
        <span className="summary__service-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <circle cx="6" cy="6" r="2.2" />
            <circle cx="6" cy="18" r="2.2" />
            <path d="M8 7.4 20 18M8 16.6 20 6" />
          </svg>
        </span>
        <div>
          <p className="summary__service-name">Мужская стрижка</p>
          <p className="summary__service-meta">60 минут · уход и укладка</p>
        </div>
      </div>

      <a className="summary__change" href="#">
        Изменить услугу
      </a>

      <div className="summary__divider" />

      <div className="summary__master">
        <span className="summary__avatar" aria-hidden="true">
          АК
        </span>
        <div className="summary__master-info">
          <p className="summary__master-name">Артём Ковалёв</p>
          <p className="summary__master-role">Топ-барбер · стаж 8 лет</p>
        </div>
        <span className="summary__rating">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="m12 3.6 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3.6Z" />
          </svg>
          <span className="sr-only">Рейтинг</span>
          4,9
          <span className="sr-only">из 5</span>
        </span>
      </div>

      <div className="summary__divider" />

      <div className="summary__place">
        <span className="summary__place-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
        </span>
        <div>
          <p className="summary__place-name">Лезвие на Патриарших</p>
          <p className="summary__place-address">ул. Малая Бронная, 12</p>
        </div>
      </div>

      <a className="summary__change" href="#">
        Изменить филиал
      </a>

      <div className="summary__divider" />

      <dl className="summary__list">
        <div className="summary__row">
          <dt>Стоимость</dt>
          <dd>2 500 ₽</dd>
        </div>
        <div className="summary__row">
          <dt>Длительность</dt>
          <dd>60 минут</dd>
        </div>
      </dl>

      <p className="summary__note">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
        Бесплатная отмена или перенос за 2 часа до визита
      </p>
    </aside>
  );
}
