"""Backend. Задание 3. Мастера салона в SQLite через SQLAlchemy."""

from __future__ import annotations

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, func, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Базовый класс для моделей SQLAlchemy."""


db = SQLAlchemy(model_class=Base)

app = Flask(__name__)

# Отдавать кириллицу в JSON в читаемом виде.
app.json.ensure_ascii = False

# Файл базы данных будет создан в папке instance рядом с приложением.
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///salon.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


class Master(db.Model):
    """Мастер салона.

    Таблица masters хранит минимум три поля: id, name и specialization.
    """

    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(100), nullable=False)

    def to_dict(self) -> dict:
        """Превратить мастера в словарь для JSON-ответа."""
        return {
            "id": self.id,
            "name": self.name,
            "specialization": self.specialization,
        }

    def __repr__(self) -> str:
        return (
            f"Master(id={self.id!r}, name={self.name!r}, "
            f"specialization={self.specialization!r})"
        )


# Начальные данные для таблицы masters.
INITIAL_MASTERS = [
    {"name": "Анна", "specialization": "Парикмахер"},
    {"name": "Мария", "specialization": "Визажист"},
    {"name": "Ольга", "specialization": "Мастер маникюра"},
]


def seed_masters() -> None:
    """Заполнить таблицу мастерами, если она ещё пустая."""
    masters_count = db.session.scalar(select(func.count()).select_from(Master))
    if masters_count:
        return

    db.session.add_all([Master(**master) for master in INITIAL_MASTERS])
    db.session.commit()


def init_db() -> None:
    """Создать таблицы и добавить начальные данные."""
    with app.app_context():
        db.create_all()
        seed_masters()


@app.get("/masters")
def get_masters():
    """GET /masters — список мастеров.

    Поддерживает фильтр ?specialization=..., например:
    /masters?specialization=Парикмахер
    """
    specialization = (request.args.get("specialization") or "").strip()

    statement = select(Master)
    if specialization:
        statement = statement.where(Master.specialization == specialization)

    masters = db.session.scalars(statement.order_by(Master.id)).all()
    return jsonify([master.to_dict() for master in masters])


@app.get("/masters/<master_id>")
def get_master(master_id: str):
    """GET /masters/{master_id} — один мастер или 404 Not Found."""
    try:
        master_id_int = int(master_id)
    except ValueError:
        return "Master not found", 404

    master = db.session.get(Master, master_id_int)
    if master is None:
        return "Master not found", 404

    return jsonify(master.to_dict())


# Создаём таблицы при запуске приложения (в том числе при импорте в тестах).
init_db()


if __name__ == "__main__":
    app.run(debug=True)
