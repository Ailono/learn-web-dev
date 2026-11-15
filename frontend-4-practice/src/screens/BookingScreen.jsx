import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import PageIntro from "../components/PageIntro.jsx";
import BookingSummary from "../components/BookingSummary.jsx";
import CalendarCard from "../components/CalendarCard.jsx";
import CalendarState from "../components/CalendarState.jsx";
import BookingBottomBar from "../components/BookingBottomBar.jsx";
import { getDefaultDay } from "../data/date.js";
import { fetchSlots, fetchToday } from "../api.js";

export default function BookingScreen() {
  const [todayState, setTodayState] = useState({
    data: null,
    loading: true,
    error: null,
  });
  const [todayRetry, setTodayRetry] = useState(0);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRetry, setSlotsRetry] = useState(0);

  // Загружаем «сегодня» с сервера при открытии страницы.
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    setTodayState({ data: null, loading: true, error: null });
    setCurrentYear(null);
    setCurrentMonth(null);
    setSelectedDay(null);
    setSelectedTime(null);
    setSlots([]);
    setSlotsLoading(false);
    setSlotsError(null);

    fetchToday({ signal: controller.signal })
      .then((data) => {
        if (ignore) return;

        const todayDate = new Date(data.year, data.month, data.day);
        const defaultDay = getDefaultDay(data.year, data.month, todayDate);

        setTodayState({ data, loading: false, error: null });
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(defaultDay);
        setSlotsLoading(defaultDay !== null);
      })
      .catch((error) => {
        if (ignore || error.name === "AbortError") return;
        setTodayState({ data: null, loading: false, error: error.message });
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [todayRetry]);

  // Загружаем слоты при каждом изменении выбранной даты.
  useEffect(() => {
    if (!todayState.data) return undefined;

    if (
      selectedDay === null ||
      currentMonth === null ||
      currentYear === null
    ) {
      setSlots([]);
      setSlotsLoading(false);
      setSlotsError(null);
      return undefined;
    }

    const controller = new AbortController();
    let ignore = false;

    setSlotsLoading(true);
    setSlotsError(null);

    fetchSlots(
      { day: selectedDay, month: currentMonth, year: currentYear },
      { signal: controller.signal }
    )
      .then((data) => {
        if (ignore) return;

        // Защита от гонок: применяем только ответ на актуальную дату.
        const date = data.date;
        if (
          !date ||
          date.day !== selectedDay ||
          date.month !== currentMonth ||
          date.year !== currentYear
        ) {
          setSlotsLoading(false);
          return;
        }

        setSlots(Array.isArray(data.slots) ? data.slots : []);
        setSlotsLoading(false);
      })
      .catch((error) => {
        if (ignore || error.name === "AbortError") return;
        setSlotsError(error.message);
        setSlotsLoading(false);
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [todayState.data, selectedDay, currentMonth, currentYear, slotsRetry]);

  const todayDate = todayState.data
    ? new Date(todayState.data.year, todayState.data.month, todayState.data.day)
    : null;

  const selectedDate =
    todayDate && selectedDay !== null && currentMonth !== null && currentYear !== null
      ? new Date(currentYear, currentMonth, selectedDay)
      : null;

  function handleDayClick(day) {
    if (day === selectedDay) return;

    setSelectedDay(day);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
    setSlotsLoading(true);
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function handleMonthChange(step) {
    if (!todayDate || currentMonth === null || currentYear === null) return;

    const nextMonth = new Date(currentYear, currentMonth + step, 1);
    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth();
    const defaultDay = getDefaultDay(year, month, todayDate);

    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDay(defaultDay);
    setSelectedTime(null);
    setSlots([]);
    setSlotsError(null);
    setSlotsLoading(defaultDay !== null);
  }

  function handleRetryToday() {
    setTodayRetry((value) => value + 1);
  }

  function handleRetrySlots() {
    setSlotsError(null);
    setSlotsLoading(true);
    setSlotsRetry((value) => value + 1);
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

            {todayState.loading ? (
              <CalendarState loading />
            ) : todayState.error ? (
              <CalendarState
                error={todayState.error}
                onRetry={handleRetryToday}
              />
            ) : (
              <CalendarCard
                currentYear={currentYear}
                currentMonth={currentMonth}
                today={todayDate}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                slots={slots}
                slotsLoading={slotsLoading}
                slotsError={slotsError}
                selectedDate={selectedDate}
                onPrevMonth={() => handleMonthChange(-1)}
                onNextMonth={() => handleMonthChange(1)}
                onDayClick={handleDayClick}
                onTimeClick={handleTimeClick}
                onRetrySlots={handleRetrySlots}
              />
            )}
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
