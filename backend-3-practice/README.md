# Backend. Задание 3 — мастера салона в SQLite

Мастера хранятся в базе SQLite, доступ к ним идёт через SQLAlchemy-модель `Master`.

## Установка и запуск

```bash
python -m pip install -r requirements.txt
python app.py
```

Сервер запустится на `http://127.0.0.1:5000`.

При первом запуске SQLAlchemy создаёт файл базы `instance/salon.db` и таблицу `masters`, после чего добавляет начальных мастеров:

| id | name  | specialization  |
|----|-------|-----------------|
| 1  | Анна  | Парикмахер      |
| 2  | Мария | Визажист        |
| 3  | Ольга | Мастер маникюра |

Повторный запуск не дублирует данные: начальные записи добавляются только в пустую таблицу.

## Модель

```python
class Master(db.Model):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(100), nullable=False)
```

Таблица `masters` в SQLite:

```sql
CREATE TABLE masters (
    id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);
```

## Эндпоинты

### Список мастеров

```http
GET /masters
```

```json
[
  { "id": 1, "name": "Анна", "specialization": "Парикмахер" },
  { "id": 2, "name": "Мария", "specialization": "Визажист" },
  { "id": 3, "name": "Ольга", "specialization": "Мастер маникюра" }
]
```

### Фильтр по специализации

```http
GET /masters?specialization=Парикмахер
```

```json
[
  { "id": 1, "name": "Анна", "specialization": "Парикмахер" }
]
```

Если специализация не указана или пустая, возвращаются все мастера.

### Один мастер по id

```http
GET /masters/1
```

```json
{ "id": 1, "name": "Анна", "specialization": "Парикмахер" }
```

Если мастера с таким `id` нет, возвращается статус `404 Not Found` и текст:

```text
Master not found
```

## Файлы

- `app.py` — Flask-приложение, модель `Master`, создание таблицы, начальные данные и эндпоинты;
- `requirements.txt` — зависимости Flask, Flask-SQLAlchemy и SQLAlchemy.
