from sqlmodel import select
from backend.database.database import SessionDep
from backend.database.models import Canton


def get_all_cantons(db: SessionDep):
    return db.exec(select(Canton)).all()


def create_canton(canton: Canton, db: SessionDep) -> Canton:
    db.add(canton)
    db.commit()
    db.refresh(canton)
    return canton
