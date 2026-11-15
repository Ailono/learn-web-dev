/* =========================================================
   Данные
   ========================================================= */

const MONTHS_NOMINATIVE = [
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

const MONTHS_GENITIVE = [
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
const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const DAYS_OF_WEEK_LOWER = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

const TIME_GROUPS = [
  {
    title: "Утро",
    slots: ["10:00", "10:30", "11:00", "11:30", "12:00"],
  },
  {
    title: "День",
    slots: [
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ],
  },
  {
    title: "Вечер",
    slots: [
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ],
  },
];

// Даты, на которые всё занято. Формат: YYYY-MM-DD.
const FULLY_BOOKED_DATES = ["2026-11-20"];

/* =========================================================
   Состояние
   ========================================================= */

const state = {
  today: null,
  currentYear: 0,
  currentMonth: 0, // 0-индексный, как в Date
  selectedDay: null,
  selectedTime: null,
};

/* =========================================================
   DOM-элементы
   ========================================================= */

const calendarGrid = document.querySelector("#calendarGrid");
const monthLabel = document.querySelector("#monthLabel");
const prevMonthBtn = document.querySelector("#prevMonthBtn");
const nextMonthBtn = document.querySelector("#nextMonthBtn");
const timeBlockDate = document.querySelector("#timeBlockDate");
const timeSlots = document.querySelector("#timeSlots");
const selectionSummary = document.querySelector("#selectionSummary");
const continueBtn = document.querySelector("#continueBtn");

/* =========================================================
   Чистые функции
   ========================================================= */

// Сетка календаря с понедельника: массив недель по 7 ячеек.
// null — пустая ячейка в начале или в конце месяца.
function buildCalendarGrid(year, month) {
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
function compareDates(date1, date2) {
  const first = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate()
  ).getTime();
  const second = new Date(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate()
  ).getTime();

  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}

// День можно выбрать, если он не раньше сегодняшнего.
function isDateSelectable(day, month, year, today) {
  const date = new Date(year, month, day);
  return compareDates(date, today) >= 0;
}

function getDateKey(year, month, day) {
  const monthPart = String(month + 1).padStart(2, "0");
  const dayPart = String(day).padStart(2, "0");
  return `${year}-${monthPart}-${dayPart}`;
}

// Набор слотов на конкретную дату всегда одинаковый.
function getSlotsForDate(year, month, day) {
  const key = getDateKey(year, month, day);
  const fullyBooked = FULLY_BOOKED_DATES.includes(key);

  return TIME_GROUPS.map((group) => ({
    title: group.title,
    slots: group.slots.map((time, index) => {
      const seed = year * 372 + (month + 1) * 31 + day;
      const busy =
        fullyBooked || (seed * 17 + index * 29 + group.slots.length) % 7 === 0;

      return { time, busy };
    }),
  }));
}

function getFlatSlots(year, month, day) {
  return getSlotsForDate(year, month, day).flatMap((group) => group.slots);
}

function getFreeSlotsCount(year, month, day) {
  return getFlatSlots(year, month, day).filter((slot) => !slot.busy).length;
}

// «1 слот», «2 слота», «5 слотов».
function pluralizeSlots(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "слот";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "слота";
  return "слотов";
}

function getSelectedDate() {
  if (!state.selectedDay) return null;
  return new Date(state.currentYear, state.currentMonth, state.selectedDay);
}

/* =========================================================
   Рендер календаря
   ========================================================= */

function renderDayCell(day) {
  if (day === null) {
    return '<span class="date-cell date-cell--empty" aria-hidden="true"></span>';
  }

  const { currentYear, currentMonth, today } = state;
  const date = new Date(currentYear, currentMonth, day);
  const selectable = isDateSelectable(day, currentMonth, currentYear, today);
  const selected = state.selectedDay === day;
  const isToday = compareDates(date, today) === 0;

  const freeCount = getFreeSlotsCount(currentYear, currentMonth, day);
  const classes = ["date-cell"];
  if (!selectable) classes.push("date-cell--disabled");
  if (isToday) classes.push("date-cell--today");
  if (selected) classes.push("date-cell--selected");

  const metaText =
    freeCount === 0
      ? "нет мест"
      : `${freeCount} ${pluralizeSlots(freeCount)}`;
  const metaClass =
    freeCount > 0 && freeCount <= 3
      ? "date-cell__meta date-cell__meta--low"
      : "date-cell__meta";

  const weekday = DAYS_OF_WEEK_LOWER[date.getDay()];
  const dateLabel = `${weekday}, ${day} ${MONTHS_GENITIVE[currentMonth]}${selectable ? "" : ", недоступно"}`;

  return `
    <button
      class="${classes.join(" ")}"
      type="button"
      data-day="${day}"
      aria-pressed="${selected}"
      ${selectable ? "" : "disabled"}
    >
      <span class="date-cell__inner">
        <span class="date-cell__num">${day}</span>
        <span class="${metaClass}">${metaText}</span>
      </span>
      <span class="sr-only">${dateLabel}</span>
    </button>
  `;
}

function renderCalendar() {
  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);

  calendarGrid.innerHTML = weeks
    .map((week) => week.map(renderDayCell).join(""))
    .join("");

  calendarGrid.querySelectorAll(".date-cell[data-day]").forEach((button) => {
    button.addEventListener("click", onDayClick);
  });
}

/* =========================================================
   Рендер слотов времени
   ========================================================= */

function renderSlotButton(slot) {
  if (slot.busy) {
    return `
      <button
        class="time-slot time-slot--busy"
        type="button"
        aria-label="${slot.time} — занято"
        disabled
      >
        <span class="time-slot__box">${slot.time}</span>
      </button>
    `;
  }

  const selected = state.selectedTime === slot.time;

  return `
    <button
      class="time-slot${selected ? " time-slot--selected" : ""}"
      type="button"
      data-time="${slot.time}"
      aria-label="${slot.time}"
      aria-pressed="${selected}"
    >
      <span class="time-slot__box">${slot.time}</span>
    </button>
  `;
}

function renderTimeSlots() {
  const selectedDate = getSelectedDate();

  if (!selectedDate) {
    timeBlockDate.textContent = "Выберите дату";
    timeSlots.innerHTML =
      '<p class="time-empty">Выберите дату в календаре, чтобы увидеть свободное время.</p>';
    return;
  }

  timeBlockDate.textContent = `${selectedDate.getDate()} ${MONTHS_GENITIVE[selectedDate.getMonth()]}, ${DAYS_OF_WEEK_LOWER[selectedDate.getDay()]}`;

  const groups = getSlotsForDate(
    state.currentYear,
    state.currentMonth,
    state.selectedDay
  );

  const allBusy = groups
    .flatMap((group) => group.slots)
    .every((slot) => slot.busy);

  timeSlots.innerHTML = allBusy
    ? '<p class="time-empty">На этот день свободных слотов не осталось. Выберите другую дату.</p>'
    : groups
        .map(
          (group) => `
            <fieldset class="time-group">
              <legend class="time-group__title">${group.title}</legend>
              <div class="time-group__grid">
                ${group.slots.map(renderSlotButton).join("")}
              </div>
            </fieldset>
          `
        )
        .join("");

  timeSlots.querySelectorAll(".time-slot[data-time]").forEach((button) => {
    button.addEventListener("click", onTimeSlotClick);
  });
}

/* =========================================================
   Нижняя панель и навигация по месяцам
   ========================================================= */

function updateBottomBar() {
  const selectedDate = getSelectedDate();

  if (!selectedDate) {
    selectionSummary.textContent = "Дата не выбрана · время не выбрано";
    selectionSummary.classList.add("booking-footer__selected--empty");
    continueBtn.disabled = true;
    return;
  }

  const dateLabel = `${DAYS_OF_WEEK[selectedDate.getDay()]}, ${selectedDate.getDate()} ${MONTHS_GENITIVE[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const timeLabel = state.selectedTime || "время не выбрано";

  selectionSummary.textContent = `${dateLabel} · ${timeLabel}`;
  selectionSummary.classList.toggle(
    "booking-footer__selected--empty",
    !state.selectedTime
  );
  continueBtn.disabled = !state.selectedTime;
}

function updateMonthNav() {
  monthLabel.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;
  prevMonthBtn.disabled = false;
}

// Первый доступный день месяца. Для текущего месяца это сегодня.
function selectDefaultDay() {
  const daysInMonth = new Date(
    state.currentYear,
    state.currentMonth + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day += 1) {
    if (isDateSelectable(day, state.currentMonth, state.currentYear, state.today)) {
      state.selectedDay = day;
      return;
    }
  }

  state.selectedDay = null;
}

function changeMonth(step) {
  const nextMonth = new Date(
    state.currentYear,
    state.currentMonth + step,
    1
  );

  state.currentYear = nextMonth.getFullYear();
  state.currentMonth = nextMonth.getMonth();
  state.selectedTime = null;
  selectDefaultDay();

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  updateMonthNav();
}

/* =========================================================
   Обработчики
   ========================================================= */

function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (!day) return;

  state.selectedDay = day;
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;

  renderTimeSlots();
  updateBottomBar();
}

/* =========================================================
   Инициализация
   ========================================================= */

function init() {
  const now = new Date();
  state.today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  state.currentYear = state.today.getFullYear();
  state.currentMonth = state.today.getMonth();
  state.selectedDay = null;
  state.selectedTime = null;

  selectDefaultDay();

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  updateMonthNav();

  prevMonthBtn.addEventListener("click", () => changeMonth(-1));
  nextMonthBtn.addEventListener("click", () => changeMonth(1));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
