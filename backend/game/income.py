import logging
from sqlmodel import select

from ..database.database import SessionDep
from ..database.models import Team
from .helpers import new_event

logger = logging.getLogger(__name__)

time_stopped = False


def set_time_stopped(value: bool):
    global time_stopped
    time_stopped = value


def is_time_stopped():
    return time_stopped


def give_income(db: SessionDep):
    logger.info("give income")
    # Check if game is started

    # find teams
    teams = db.exec(select(Team)).all()
    for team in teams:
        team.money += team.income

        if team.income > 0:
            text = "{} has earned {} in passive income".format(team.name, team.income)
            new_event(db, text, team.name)

        db.add(team)
        db.commit()
        db.refresh(team)

    pass
