const STEPS = [
  { label: "Услуга", done: true },
  { label: "Мастер", done: true },
  { label: "Дата и время", current: true, number: 3 },
  { label: "Подтверждение", number: 4 },
];

export default function PageIntro() {
  return (
    <>
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <ol className="breadcrumbs__list">
          <li className="breadcrumbs__item">
            <a href="#">Главная</a>
          </li>
          <li className="breadcrumbs__item">
            <a href="#">Запись</a>
          </li>
          <li className="breadcrumbs__item" aria-current="page">
            Дата и время
          </li>
        </ol>
      </nav>

      <div className="page-head">
        <div className="page-head__text">
          <p className="eyebrow">Запись в барбершоп</p>
          <h1 className="page-title">Выбор даты и&nbsp;времени</h1>
          <p className="page-subtitle">
            Остался последний шаг перед подтверждением. Выберите удобный день и
            свободный слот — мы закрепим его за вами.
          </p>
        </div>
        <p className="page-head__aside">
          <span className="page-head__aside-value">3</span>
          <span className="page-head__aside-text">шаг из 4</span>
        </p>
      </div>

      <ol className="steps" aria-label="Этапы записи">
        {STEPS.map((step) => {
          const classNames = ["steps__item"];
          if (step.done) classNames.push("steps__item--done");
          if (step.current) classNames.push("steps__item--current");

          return (
            <li
              className={classNames.join(" ")}
              key={step.label}
              aria-current={step.current ? "step" : undefined}
            >
              <span className="steps__num" aria-hidden="true">
                {step.done ? "✓" : step.number}
              </span>
              <span className="steps__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
}
