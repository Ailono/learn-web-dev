import { useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PageIntro from "../components/PageIntro.jsx";
import BookingSummary from "../components/BookingSummary.jsx";
import CalendarCard from "../components/CalendarCard.jsx";
import BookingBottomBar from "../components/BookingBottomBar.jsx";
import {
  getDefaultDay,
  startOfDay,
} from "../data/date.js";
import { getSlotsForDate } from "../data/slots.js";

export default function BookingScreen() {
  const [today] = useState(() => startOfDay(new Date()));

  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(() =>
    getDefaultDay(currentYear, currentMonth, today)
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() =>
    selectedDay === null
      ? []
      : getSlotsForDate(currentYear, currentMonth, selectedDay)
  );

  const selectedDate =
    selectedDay === null
      ? null
      : new Date(currentYear, currentMonth, selectedDay);

  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlotsForDate(currentYear, currentMonth, day));
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function handleMonthChange(step) {
    const nextMonth = new Date(currentYear, currentMonth + step, 1);
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth();
    const day = getDefaultDay(year, month, today);

    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(day === null ? [] : getSlotsForDate(year, month, day));
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержанию
      </a>

      <SiteHeader />

      <main className="page" id="main">
        <div className="container">
          <PageIntro />

          <div className="booking-layout">
            <BookingSummary />

            <CalendarCard
              currentYear={currentYear}
              currentMonth={currentMonth}
              today={today}
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              slots={slots}
              selectedDate={selectedDate}
              onPrevMonth={() => handleMonthChange(-1)}
              onNextMonth={() => handleMonthChange(1)}
              onDayClick={handleDayClick}
              onTimeClick={handleTimeClick}
            />
          </div>

          <BookingBottomBar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
