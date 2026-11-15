"""Задание 1. Класс Appointment (запись клиента).

Правила:
- запись создаётся только при заполненных полях;
- мастер и услуга должны существовать;
- время должно быть корректным и входить в часы работы салона (08:00–20:00);
- на одно время нельзя записать двух клиентов (действующее правило салона).
"""

from __future__ import annotations

from dataclasses import dataclass

# Часы работы салона в минутах от начала суток.
WORKDAY_START = 8 * 60
WORKDAY_END = 20 * 60


@dataclass(frozen=True)
class Master:
    """Мастер салона."""

    master_id: int
    full_name: str
    specialization: str


@dataclass(frozen=True)
class Service:
    """Услуга салона."""

    service_id: int
    title: str
    price: int
    duration_minutes: int


class Appointment:
    """Запись клиента к мастеру на услугу."""

    def __init__(
        self,
        appointment_id: int,
        client_name: str,
        master: Master,
        service: Service,
        time: str,
    ) -> None:
        self.id = appointment_id
        self.client_name = client_name
        self.master = master
        self.service = service
        self.master_id = master.master_id
        self.service_id = service.service_id
        self.time = time

    def __str__(self) -> str:
        return f"{self.client_name} — {self.time}"

    def __repr__(self) -> str:
        return (
            f"Appointment(id={self.id!r}, client_name={self.client_name!r}, "
            f"master_id={self.master_id!r}, service_id={self.service_id!r}, "
            f"time={self.time!r})"
        )


masters = [
    Master(1, "Артём Ковалёв", "топ-барбер"),
    Master(2, "Михаил Орлов", "барбер"),
]

services = [
    Service(1, "Мужская стрижка", 2500, 60),
    Service(2, "Бритьё", 1800, 45),
]

appointments: list[Appointment] = []


def get_master(master_id: int) -> Master | None:
    """Вернуть мастера по id или None, если такого мастера нет."""
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    """Вернуть услугу по id или None, если такой услуги нет."""
    for service in services:
        if service.service_id == service_id:
            return service
    return None


def is_filled(value: object) -> bool:
    """Поле считается заполненным, если оно не None и не пустая строка."""
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    return True


def normalize_time(value: str | None) -> str | None:
    """Привести время к формату HH:MM или вернуть None для неверного формата."""
    if not isinstance(value, str):
        return None

    parts = value.strip().split(":")
    if len(parts) != 2:
        return None

    hours_text, minutes_text = parts
    if not hours_text.isdigit() or not minutes_text.isdigit():
        return None
    if len(minutes_text) != 2:
        return None

    hours = int(hours_text)
    minutes = int(minutes_text)
    if hours > 23 or minutes > 59:
        return None

    return f"{hours:02d}:{minutes:02d}"


def is_working_time(value: str) -> bool:
    """Проверить, что время входит в часы работы салона."""
    normalized = normalize_time(value)
    if normalized is None:
        return False

    hours, minutes = (int(part) for part in normalized.split(":"))
    minutes_from_midnight = hours * 60 + minutes
    return WORKDAY_START <= minutes_from_midnight <= WORKDAY_END


def is_time_taken(value: str) -> bool:
    """Проверить, что на это время уже есть запись."""
    return any(appointment.time == value for appointment in appointments)


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    """Создать запись клиента.

    Возвращает объект Appointment или None, если запись создать нельзя:
    не заполнены поля, нет мастера или услуги, неверное время,
    время вне часов работы или время уже занято.
    """
    master = get_master(master_id)
    service = get_service(service_id)

    if not is_filled(client_name) or master is None or service is None:
        return None

    normalized_time = normalize_time(time)
    if normalized_time is None or not is_working_time(normalized_time):
        return None

    # Действующее правило: на одно время нельзя записать двух клиентов.
    if is_time_taken(normalized_time):
        return None

    appointment = Appointment(
        appointment_id=len(appointments) + 1,
        client_name=client_name.strip(),
        master=master,
        service=service,
        time=normalized_time,
    )
    appointments.append(appointment)
    return appointment


def print_appointments() -> None:
    """Вывести список записей в формате из задания."""
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)


def demo() -> None:
    """Продемонстрировать работу create_appointment."""
    # 1. Две корректные записи.
    appointments.clear()
    create_appointment("Иванова А.А.", 1, 1, "10:00")
    create_appointment("Петрова А.А.", 1, 1, "11:00")
    print_appointments()

    # 2. Не заполнено имя клиента — запись не создаётся.
    appointments.clear()
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print("\nПопытка с пустым именем:", no_correct_appointment)
    print("Количество записей:", len(appointments))

    # 3. Некорректное время — запись не создаётся.
    appointments.clear()
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print("\nПопытка записать на 00:00:", no_correct_appointment)
    print("Количество записей:", len(appointments))

    # 4. Время уже занято — вторая запись не создаётся.
    appointments.clear()
    create_appointment("Иванова А.А.", 1, 1, "10:00")
    busy_appointment = create_appointment("Петрова А.А.", 2, 2, "10:00")
    print("\nПопытка записать на занятое время:", busy_appointment)
    print("Количество записей:", len(appointments))


if __name__ == "__main__":
    demo()
