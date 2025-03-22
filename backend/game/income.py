from datetime import datetime
import logging
from sqlmodel import select

from ..database.database import SessionDep
from ..database.models import Game, Team
from .helpers import new_event

logger = logging.getLogger(__name__)


def is_passive_income_enabled(db: SessionDep):

    game = db.get(Game, 1)

    if game is None:
        return True

    tz = game.start.tzinfo

    now = datetime.now(tz)
    if now < game.start:
        return False

    if now > game.end:
        return False

    if now > game.end:
        return False

    time = now.time()

    if time < game.day_start:
        return False

    if time > game.day_end:
        return False

    return game.passive_income_enabled


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
