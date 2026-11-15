// «База данных» имитационного сервера.

// «Сегодня» приходит на клиент с сервера, а не вычисляется в браузере.
export const today = { day: 16, month: 10, year: 2026 };

// Два набора слотов: для будних и для выходных дней.
export const weekdaySlots = [
  { time: "10:00", available: true },
  { time: "10:30", available: false },
  { time: "11:00", available: true },
  { time: "11:30", available: true },
  { time: "12:00", available: false },
  { time: "12:30", available: true },
  { time: "13:00", available: true },
  { time: "13:30", available: false },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "15:30", available: false },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
  { time: "17:00", available: false },
  { time: "17:30", available: true },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
  { time: "19:00", available: false },
  { time: "19:30", available: true },
  { time: "20:00", available: true },
  { time: "20:30", available: false },
];

export const weekendSlots = [
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "12:00", available: true },
  { time: "12:30", available: false },
  { time: "13:00", available: true },
  { time: "13:30", available: true },
  { time: "14:00", available: false },
  { time: "14:30", available: true },
  { time: "15:00", available: true },
  { time: "15:30", available: true },
  { time: "16:00", available: false },
  { time: "16:30", available: true },
  { time: "17:00", available: true },
  { time: "17:30", available: false },
  { time: "18:00", available: true },
  { time: "18:30", available: true },
  { time: "19:00", available: true },
  { time: "19:30", available: false },
  { time: "20:00", available: true },
  { time: "20:30", available: true },
];

// Даты, на которые всё занято. Формат: YYYY-MM-DD.
export const fullyBookedDates = ["2026-11-20"];

function getDateKey(day, month, year) {
  const monthPart = String(month + 1).padStart(2, "0");
  const dayPart = String(day).padStart(2, "0");
  return `${year}-${monthPart}-${dayPart}`;
}

export function getSlots(day, month, year) {
  const date = new Date(year, month, day);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const source = isWeekend ? weekendSlots : weekdaySlots;

  if (fullyBookedDates.includes(getDateKey(day, month, year))) {
    return source.map((slot) => ({ ...slot, available: false }));
  }

  return source.map((slot) => ({ ...slot }));
}
