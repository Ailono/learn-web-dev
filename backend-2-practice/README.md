# Backend. Задание 2 — эндпоинты категорий

Flask-приложение с двумя эндпоинтами для категорий услуг.

## Установка и запуск

```bash
python -m pip install -r requirements.txt
python app.py
```

Сервер запустится на `http://127.0.0.1:5000`.

## Эндпоинты

### Список категорий

```http
GET /categories
```

Возвращает массив всех категорий с количеством услуг в каждой:

```json
[
  { "id": 1, "name": "Стрижки и укладки", "servicesCount": 5 },
  { "id": 2, "name": "Маникюр и педикюр", "servicesCount": 5 },
  { "id": 3, "name": "Брови и ресницы", "servicesCount": 4 },
  { "id": 4, "name": "Спа-процедуры", "servicesCount": 4 }
]
```

### Информация по категории

```http
GET /categories/{category_id}
```

Пример для `GET /categories/1`:

```json
{ "id": 1, "name": "Стрижки и укладки", "servicesCount": 5 }
```

Если категории с таким `id` нет, возвращается статус `404` и текст:

```text
Category not found
```

`servicesCount` не хранится вручную: он вычисляется по списку услуг, у которых `category_id` совпадает с id категории.

## Файлы

- `app.py` — Flask-приложение, данные категорий и услуг, эндпоинты;
- `requirements.txt` — зависимость Flask.
