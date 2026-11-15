"""Backend. Задание 2. Эндпоинты категорий услуг."""

from flask import Flask, jsonify

app = Flask(__name__)

# Возвращать кириллицу в JSON в читаемом виде, а не escape-последовательностями.
app.json.ensure_ascii = False

# Категории услуг.
categories = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

# Услуги. Принадлежность к категории хранится в category_id.
services = [
    {"id": 1, "category_id": 1, "name": "Женская стрижка", "price": 3500},
    {"id": 2, "category_id": 1, "name": "Мужская стрижка", "price": 2500},
    {"id": 3, "category_id": 1, "name": "Укладка волос", "price": 2000},
    {"id": 4, "category_id": 1, "name": "Окрашивание волос", "price": 6000},
    {"id": 5, "category_id": 1, "name": "Детская стрижка", "price": 1500},
    {"id": 6, "category_id": 2, "name": "Классический маникюр", "price": 1800},
    {"id": 7, "category_id": 2, "name": "Аппаратный маникюр", "price": 2200},
    {"id": 8, "category_id": 2, "name": "Педикюр", "price": 2500},
    {"id": 9, "category_id": 2, "name": "Наращивание ногтей", "price": 4000},
    {"id": 10, "category_id": 2, "name": "Дизайн ногтей", "price": 800},
    {"id": 11, "category_id": 3, "name": "Коррекция бровей", "price": 1200},
    {"id": 12, "category_id": 3, "name": "Окрашивание бровей", "price": 1500},
    {"id": 13, "category_id": 3, "name": "Ламинирование ресниц", "price": 3000},
    {"id": 14, "category_id": 3, "name": "Наращивание ресниц", "price": 3500},
    {"id": 15, "category_id": 4, "name": "Спа-массаж", "price": 4500},
    {"id": 16, "category_id": 4, "name": "Обёртывание", "price": 3800},
    {"id": 17, "category_id": 4, "name": "Пилинг", "price": 3200},
    {"id": 18, "category_id": 4, "name": "Уход за лицом", "price": 5000},
]


def count_services(category_id: int) -> int:
    """Посчитать количество услуг в категории."""
    return sum(1 for service in services if service["category_id"] == category_id)


def category_payload(category: dict) -> dict:
    """Собрать ответ по категории: id, name и количество услуг."""
    return {
        "id": category["id"],
        "name": category["name"],
        "servicesCount": count_services(category["id"]),
    }


def find_category(category_id: int) -> dict | None:
    """Найти категорию по id."""
    for category in categories:
        if category["id"] == category_id:
            return category
    return None


@app.route("/categories", methods=["GET"])
def get_categories():
    """GET /categories — список всех категорий с количеством услуг."""
    return jsonify([category_payload(category) for category in categories])


@app.route("/categories/<category_id>", methods=["GET"])
def get_category(category_id: str):
    """GET /categories/{category_id} — информация о конкретной категории."""
    try:
        category_id_int = int(category_id)
    except ValueError:
        return "Category not found", 404

    category = find_category(category_id_int)
    if category is None:
        return "Category not found", 404

    return jsonify(category_payload(category))


if __name__ == "__main__":
    app.run(debug=True)
