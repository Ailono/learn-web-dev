// Клиент запросов к имитационному серверу.

const API_BASE = "/api";

// Для проверки сценариев ошибки откройте страницу с параметром:
// ?fail=1 — ошибка обоих запросов, ?fail=today — только «сегодня»,
// ?fail=slots — только слоты.
const FAIL_MODE =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("fail")
    : null;

function shouldFail(path) {
  if (FAIL_MODE === "1") return true;
  if (FAIL_MODE === "today") return path.includes("/booking/today");
  if (FAIL_MODE === "slots") return path.includes("/slots");
  return false;
}

async function request(path, options = {}) {
  const url = shouldFail(path)
    ? `${path}${path.includes("?") ? "&" : "?"}fail=1`
    : path;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    ...options,
  });

  if (!response.ok) {
    let message = `Сервер вернул ошибку ${response.status}.`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch {
      // Если тело ответа не JSON, оставляем сообщение по умолчанию.
    }
    throw new Error(message);
  }

  return response.json();
}

export function fetchToday(options = {}) {
  return request(`${API_BASE}/booking/today`, options);
}

export function fetchSlots(date, options = {}) {
  const params = new URLSearchParams({
    day: date.day,
    month: date.month,
    year: date.year,
  });

  return request(`${API_BASE}/slots?${params.toString()}`, options);
}
