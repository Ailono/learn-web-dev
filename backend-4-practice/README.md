# Backend. Задание 4 — Pydantic-модель и POST /services

Сервис салона на FastAPI: категории и услуги хранятся в SQLite через SQLAlchemy, входные данные проверяются Pydantic-моделью `ServiceCreate`.

## Установка и запуск

```bash
python -m pip install -r requirements.txt
python app.py
```

Или через uvicorn:

```bash
uvicorn app:app --reload
```

API будет доступно на `http://127.0.0.1:8000`, интерактивная документация — на `http://127.0.0.1:8000/docs`.

При первом запуске создаётся файл `salon.db`, таблицы `categories` и `services` и начальные данные: 4 категории и 18 услуг (количество услуг по категориям — `5, 5, 4, 4`).

## Модель ServiceCreate

```python
class ServiceCreate(BaseModel):
    categoryId: int = Field(gt=0)
    title: str = Field(min_length=1, max_length=100)
    desc: str = Field(min_length=1, max_length=100)
    duration: int = Field(ge=30, le=180)
    price: float = Field(gt=0)
```

Ограничения:

| Поле | Ограничение |
|------|-------------|
| `categoryId` | положительный id существующей категории |
| `title` | не пустое, до 100 символов, пробелы по краям обрезаются |
| `desc` | не пустое, до 100 символов, пробелы по краям обрезаются |
| `duration` | от 30 до 180 минут (3 часа) |
| `price` | строго больше 0 |

Некорректное тело запроса FastAPI отклоняет автоматически с кодом `422` и описанием ошибок.

## POST /services

Создаёт услугу в указанной категории и сохраняет её в БД.

```http
POST /services
Content-Type: application/json
```

Корректный запрос:

```json
{
  "categoryId": 3,
  "title": "Наращивание ресниц",
  "desc": "Огромные ресницы уже через 30 минут",
  "duration": 30,
  "price": 1500.00
}
```

Ответ `201 Created`:

```json
{
  "id": 19,
  "categoryId": 3,
  "title": "Наращивание ресниц",
  "desc": "Огромные ресницы уже через 30 минут",
  "duration": 30,
  "price": 1500.0
}
```

Неверный тип цены:

```json
{
  "categoryId": 3,
  "title": "Наращивание ресниц",
  "desc": "Огромные ресницы уже через 30 минут",
  "duration": 30,
  "price": "бесплатно"
}
```

Ответ `422 Unprocessable Entity` — ошибка валидации Pydantic.

Нарушены сразу несколько ограничений:

```json
{
  "categoryId": 3,
  "title": "Наращивание ресниц",
  "desc": "",
  "duration": 0,
  "price": -1500.00
}
```

Ответ `422` с перечнем ошибок по полям `desc`, `duration` и `price`.

Если категории с указанным `categoryId` нет, возвращается `404` и `{"detail": "Category not found"}`.

## Дополнительные эндпоинты

- `GET /services` — список всех услуг;
- `GET /services/{service_id}` — одна услуга или `404`;
- `GET /categories` — категории с количеством услуг `servicesCount`.

## Файлы

- `app.py` — FastAPI-приложение, модели SQLAlchemy и Pydantic, эндпоинты и начальные данные;
- `requirements.txt` — зависимости FastAPI, uvicorn, SQLAlchemy и Pydantic.

## Проверка

Все сценарии из задания проверены через FastAPI TestClient:

- корректный запрос — `201`;
- `price: "бесплатно"` — `422`;
- пустой `desc`, `duration: 0`, `price: -1500` — `422`;
- `duration: 29` и `duration: 181` — `422`;
- пустой `title`, `title` длиной 101 символ, `price: 0` — `422`.
