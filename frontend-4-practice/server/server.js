import { getSlots, today } from "./database.js";

// Задержка имитирует сеть: пока она идёт, на странице видна загрузка.
const DELAY_MS = 600;

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function sendWithDelay(res, statusCode, payload) {
  setTimeout(() => sendJson(res, statusCode, payload), DELAY_MS);
}

function toInteger(value) {
  if (value === null || value === "") return null;
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function isValidDate(day, month, year) {
  if (day === null || month === null || year === null) return false;
  if (month < 0 || month > 11 || day < 1 || day > 31) return false;

  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

function wantsFailure(url) {
  return url.searchParams.get("fail") === "1";
}

function handleApi(req, res) {
  if (!req.url) return false;

  const url = new URL(req.url, "http://localhost");

  if (!url.pathname.startsWith("/api/")) {
    return false;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Метод не поддерживается." });
    return true;
  }

  if (url.pathname === "/api/booking/today") {
    if (wantsFailure(url)) {
      sendWithDelay(res, 500, {
        error: "Не удалось получить сегодняшнюю дату. Попробуйте ещё раз.",
      });
      return true;
    }

    sendWithDelay(res, 200, today);
    return true;
  }

  if (url.pathname === "/api/slots") {
    const day = toInteger(url.searchParams.get("day"));
    const month = toInteger(url.searchParams.get("month"));
    const year = toInteger(url.searchParams.get("year"));

    if (!isValidDate(day, month, year)) {
      sendJson(res, 400, { error: "Некорректная дата." });
      return true;
    }

    if (wantsFailure(url)) {
      sendWithDelay(res, 500, {
        error: "Не удалось загрузить слоты. Попробуйте ещё раз.",
      });
      return true;
    }

    sendWithDelay(res, 200, {
      date: { day, month, year },
      slots: getSlots(day, month, year),
    });
    return true;
  }

  sendJson(res, 404, { error: "Эндпоинт не найден." });
  return true;
}

function apiMiddleware(req, res, next) {
  if (handleApi(req, res)) return;
  next();
}

export function mockApi() {
  return {
    name: "mock-api",
    configureServer(server) {
      server.middlewares.use(apiMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware);
    },
  };
}
