export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <a className="logo logo--footer" href="#">
              <span className="logo__mark" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <circle cx="6" cy="6" r="2.4" />
                  <circle cx="6" cy="18" r="2.4" />
                  <path d="M8.2 7.4 20 18M8.2 16.6 20 6" />
                </svg>
              </span>
              <span className="logo__text">
                ЛЕЗВИЕ
                <span className="logo__sub">barbershop</span>
              </span>
            </a>
            <p className="site-footer__about">
              Классический барбершоп на Патриарших. Стрижки, бритьё и уход — без
              суеты и компромиссов.
            </p>
            <div className="socials">
              <a className="socials__link" href="#" aria-label="Телеграм">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="m21 4.4-3.1 15.2c-.2 1-.9 1.2-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.4-4.7 8.6-7.8c.4-.3-.1-.5-.6-.2L6.7 13.1 2.1 11.7c-1-.3-1-1 0-1.4L19.8 3.7c.8-.3 1.5.2 1.2.7Z" />
                </svg>
              </a>
              <a className="socials__link" href="#" aria-label="ВКонтакте">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.2 17.6c-5 0-8.1-3.5-8.3-9.3h2.5c.1 4.3 2.1 6.1 3.6 6.5V8.3h2.4v3.9c1.4-.2 2.9-1.8 3.4-3.9h2.4c-.4 2.6-2 4.2-3.1 4.9 1.1.6 3 2 3.7 4.4h-2.7c-.5-1.7-1.9-3-3.7-3.2v3.2h-.2Z" />
                </svg>
              </a>
              <a className="socials__link" href="#" aria-label="Инстаграм">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="3.7" />
                  <circle
                    cx="17.4"
                    cy="6.6"
                    r=".9"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
            </div>
          </div>

          <nav className="site-footer__nav" aria-label="Навигация в подвале">
            <h2 className="site-footer__title">Барбершоп</h2>
            <ul className="site-footer__list">
              <li>
                <a href="#">Услуги и цены</a>
              </li>
              <li>
                <a href="#">Наши мастера</a>
              </li>
              <li>
                <a href="#">О барбершопе</a>
              </li>
              <li>
                <a href="#">Подарочные карты</a>
              </li>
            </ul>
          </nav>

          <div className="site-footer__contacts">
            <h2 className="site-footer__title">Контакты</h2>
            <ul className="site-footer__list">
              <li>
                <a href="tel:+74951234567">+7 (495) 123-45-67</a>
              </li>
              <li>
                <a href="mailto:hello@lezvie.ru">hello@lezvie.ru</a>
              </li>
              <li>Москва, ул. Малая Бронная, 12</li>
              <li>Ежедневно с 10:00 до 21:00</li>
            </ul>
          </div>

          <div className="site-footer__cta">
            <h2 className="site-footer__title">Есть вопросы?</h2>
            <p className="site-footer__cta-text">
              Напишите нам — поможем выбрать услугу и мастера.
            </p>
            <a className="btn btn--ghost" href="mailto:hello@lezvie.ru">
              Написать нам
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026 Барбершоп «Лезвие». Все права защищены.</p>
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}
