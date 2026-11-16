"""Backend. Задание 4. Pydantic-модель ServiceCreate и POST /services."""

from __future__ import annotations

from pathlib import Path
from typing import Annotated, Generator

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, Field, StringConstraints
from sqlalchemy import Float, ForeignKey, Integer, String, create_engine, func, select
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    Session,
    mapped_column,
    relationship,
    sessionmaker,
)

BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = f"sqlite:///{(BASE_DIR / 'salon.db').as_posix()}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Базовый класс для моделей SQLAlchemy."""


class Category(Base):
    """Категория услуг."""

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    services: Mapped[list["Service"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan",
    )


class Service(Base):
    """Услуга салона."""

    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    desc: Mapped[str] = mapped_column(String(100), nullable=False)
    duration: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)

    category: Mapped[Category] = relationship(back_populates="services")


# Строка услуги: не пустая после strip(), не длиннее 100 символов.
ServiceText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=100),
]


class ServiceCreate(BaseModel):
    """Pydantic-модель создания услуги.

    Ограничения:
    - categoryId — положительный id существующей категории;
    - title и desc — не пустые строки длиной до 100 символов;
    - duration — от 30 минут до 3 часов (180 минут);
    - price — строго больше 0.
    """

    categoryId: int = Field(gt=0, description="Идентификатор категории услуги")
    title: ServiceText = Field(description="Название услуги, 1–100 символов")
    desc: ServiceText = Field(description="Описание услуги, 1–100 символов")
    duration: int = Field(
        ge=30,
        le=180,
        description="Продолжительность услуги в минутах: от 30 до 180",
    )
    price: float = Field(
        gt=0,
        allow_inf_nan=False,
        description="Стоимость услуги, строго больше 0",
    )


class ServiceRead(BaseModel):
    """Услуга в ответе API."""

    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float


class CategoryRead(BaseModel):
    """Категория услуг с количеством услуг в ней."""

    id: int
    name: str
    servicesCount: int


# Начальные категории: id, название.
INITIAL_CATEGORIES = [
    (1, "Стрижки и укладки"),
    (2, "Маникюр и педикюр"),
    (3, "Брови и ресницы"),
    (4, "Спа-процедуры"),
]

# Начальные услуги. Все значения проходят ограничения ServiceCreate.
INITIAL_SERVICES = [
    {
        "category_id": 1,
        "title": "Женская стрижка",
        "desc": "Стрижка с укладкой и консультацией",
        "duration": 60,
        "price": 3500.0,
    },
    {
        "category_id": 1,
        "title": "Мужская стрижка",
        "desc": "Классическая или модельная стрижка",
        "duration": 30,
        "price": 2500.0,
    },
    {
        "category_id": 1,
        "title": "Укладка волос",
        "desc": "Вечерняя укладка с фиксацией",
        "duration": 45,
        "price": 2000.0,
    },
    {
        "category_id": 1,
        "title": "Окрашивание волос",
        "desc": "Окрашивание волос в один тон",
        "duration": 180,
        "price": 6000.0,
    },
    {
        "category_id": 1,
        "title": "Детская стрижка",
        "desc": "Стрижка для детей до 12 лет",
        "duration": 30,
        "price": 1500.0,
    },
    {
        "category_id": 2,
        "title": "Классический маникюр",
        "desc": "Маникюр с покрытием лаком",
        "duration": 60,
        "price": 1800.0,
    },
    {
        "category_id": 2,
        "title": "Аппаратный маникюр",
        "desc": "Маникюр аппаратом без воды",
        "duration": 60,
        "price": 2200.0,
    },
    {
        "category_id": 2,
        "title": "Педикюр",
        "desc": "Обработка стоп и покрытие",
        "duration": 90,
        "price": 2500.0,
    },
    {
        "category_id": 2,
        "title": "Наращивание ногтей",
        "desc": "Наращивание ногтей гелем",
        "duration": 120,
        "price": 4000.0,
    },
    {
        "category_id": 2,
        "title": "Дизайн ногтей",
        "desc": "Роспись и декор ногтей",
        "duration": 30,
        "price": 800.0,
    },
    {
        "category_id": 3,
        "title": "Коррекция бровей",
        "desc": "Коррекция формы и окрашивание бровей",
        "duration": 30,
        "price": 1200.0,
    },
    {
        "category_id": 3,
        "title": "Окрашивание бровей",
        "desc": "Стойкое окрашивание бровей",
        "duration": 30,
        "price": 1500.0,
    },
    {
        "category_id": 3,
        "title": "Ламинирование ресниц",
        "desc": "Ламинирование и ботокс ресниц",
        "duration": 60,
        "price": 3000.0,
    },
    {
        "category_id": 3,
        "title": "Наращивание ресниц",
        "desc": "Классическое наращивание ресниц",
        "duration": 120,
        "price": 3500.0,
    },
    {
        "category_id": 4,
        "title": "Спа-массаж",
        "desc": "Расслабляющий массаж тела",
        "duration": 60,
        "price": 4500.0,
    },
    {
        "category_id": 4,
        "title": "Обёртывание",
        "desc": "Питательное обёртывание тела",
        "duration": 90,
        "price": 3800.0,
    },
    {
        "category_id": 4,
        "title": "Пилинг",
        "desc": "Очищающий пилинг тела",
        "duration": 60,
        "price": 3200.0,
    },
    {
        "category_id": 4,
        "title": "Уход за лицом",
        "desc": "Комплексный уход по типу кожи",
        "duration": 90,
        "price": 5000.0,
    },
]


def init_db() -> None:
    """Создать таблицы и заполнить их начальными данными."""
    Base.metadata.create_all(engine)

    with SessionLocal() as db:
        categories_count = db.scalar(select(func.count()).select_from(Category))
        if not categories_count:
            db.add_all(
                [Category(id=category_id, name=name) for category_id, name in INITIAL_CATEGORIES]
            )
            db.commit()

        services_count = db.scalar(select(func.count()).select_from(Service))
        if not services_count:
            db.add_all([Service(**service) for service in INITIAL_SERVICES])
            db.commit()


def get_db() -> Generator[Session, None, None]:
    """Выдать сессию SQLAlchemy на время запроса."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def service_payload(service: Service) -> dict:
    """Превратить услугу из БД в словарь для ответа API."""
    return {
        "id": service.id,
        "categoryId": service.category_id,
        "title": service.title,
        "desc": service.desc,
        "duration": service.duration,
        "price": service.price,
    }


app = FastAPI(title="Salon API", version="1.0.0")

# Таблицы и начальные данные создаются при запуске приложения.
init_db()


@app.post(
    "/services",
    response_model=ServiceRead,
    status_code=status.HTTP_201_CREATED,
    tags=["services"],
)
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)):
    """POST /services — добавить услугу в существующую категорию.

    Некорректное тело запроса автоматически отклоняется Pydantic с кодом 422.
    """
    category = db.get(Category, payload.categoryId)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    service = Service(
        category_id=category.id,
        title=payload.title,
        desc=payload.desc,
        duration=payload.duration,
        price=payload.price,
    )
    db.add(service)
    db.commit()
    db.refresh(service)

    return service_payload(service)


@app.get("/services", response_model=list[ServiceRead], tags=["services"])
def get_services(db: Session = Depends(get_db)):
    """GET /services — список всех услуг."""
    services = db.scalars(select(Service).order_by(Service.id)).all()
    return [service_payload(service) for service in services]


@app.get("/services/{service_id}", response_model=ServiceRead, tags=["services"])
def get_service(service_id: int, db: Session = Depends(get_db)):
    """GET /services/{service_id} — одна услуга или 404."""
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )
    return service_payload(service)


@app.get("/categories", response_model=list[CategoryRead], tags=["categories"])
def get_categories(db: Session = Depends(get_db)):
    """GET /categories — категории с количеством услуг в каждой."""
    rows = db.execute(
        select(Category, func.count(Service.id))
        .outerjoin(Service, Service.category_id == Category.id)
        .group_by(Category.id)
        .order_by(Category.id)
    ).all()

    return [
        {
            "id": category.id,
            "name": category.name,
            "servicesCount": services_count,
        }
        for category, services_count in rows
    ]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
