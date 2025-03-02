from datetime import datetime
from ..database.database import SessionDep
from ..database.models import Event


def new_event(db: SessionDep, text: str, source: str):
    event = Event(text=text, source=source, time=datetime.now())

    db.add(event)
    db.commit()
    db.refresh(event)
