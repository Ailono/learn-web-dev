import { getDateKey } from "./date.js";

// Слоты сгруппированы по времени суток, как в макете.
export const TIME_GROUPS = [
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
export const FULLY_BOOKED_DATES = ["2026-11-20"];

// Набор слотов на конкретную дату всегда одинаковый.
export function getSlotsForDate(year, month, day) {
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

export function getFlatSlots(year, month, day) {
  return getSlotsForDate(year, month, day).flatMap((group) => group.slots);
}

export function getFreeSlotsCount(year, month, day) {
  return getFlatSlots(year, month, day).filter((slot) => !slot.busy).length;
}

// «1 слот», «2 слота», «5 слотов».
export function pluralizeSlots(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return "слот";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "слота";
  return "слотов";
}

export function formatFreeSlots(count) {
  return count === 0 ? "нет мест" : `${count} ${pluralizeSlots(count)}`;
}
