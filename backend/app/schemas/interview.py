from pydantic import BaseModel
from datetime import date, time

class ScheduleRequest(BaseModel):
    date: date
    time: time
    mode: str  # "online" / "offline"
    location: str | None = None
