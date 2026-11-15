// Чистые функции и константы для работы с датами.
// Не зависят от React — их можно использовать в любом компоненте.

export const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Индексы совпадают с Date#getDay(): 0 — воскресенье.
export const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const DAYS_OF_WEEK_LOWER = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Сетка календаря с понедельника: массив недель по 7 ячеек.
// null — пустая ячейка в начале или в конце месяца.
export function buildCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const offset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < offset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// Сравнение двух дат по календарным дням: -1, 0 или 1.
export function compareDates(date1, date2) {
  const first = startOfDay(date1).getTime();
  const second = startOfDay(date2).getTime();

  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}

// День можно выбрать, если он не раньше сегодняшнего.
export function isDateSelectable(day, month, year, today) {
  const date = new Date(year, month, day);
  return compareDates(date, today) >= 0;
}

// Первый доступный день месяца. Для текущего месяца это сегодня.
export function getDefaultDay(year, month, today) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    if (isDateSelectable(day, month, year, today)) {
      return day;
    }
  }

  return null;
}

export function getDateKey(year, month, day) {
  const monthPart = String(month + 1).padStart(2, "0");
  const dayPart = String(day).padStart(2, "0");
  return `${year}-${monthPart}-${dayPart}`;
}
