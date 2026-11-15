export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="logo" href="#">
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

        <nav className="site-nav" aria-label="Основная навигация">
          <a className="site-nav__link" href="#">
            Услуги
          </a>
          <a className="site-nav__link" href="#">
            Мастера
          </a>
          <a className="site-nav__link" href="#">
            О нас
          </a>
          <a className="site-nav__link" href="#">
            Контакты
          </a>
        </nav>

        <div className="site-header__contacts">
          <a className="site-header__phone" href="tel:+74951234567">
            +7 (495) 123-45-67
          </a>
          <span className="site-header__address">
            Москва, Малая Бронная, 12
          </span>
        </div>
      </div>
    </header>
  );
}
