from datetime import datetime
from ..database.database import SessionDep
from ..database.models import (
    Event, PowerUp, Team
)


def new_event(db: SessionDep, text: str, source: str):
    event = Event(text=text, source=source, time=datetime.now())

    db.add(event)
    db.commit()
    db.refresh(event)

# handle_powerup covers special cases where powerups modify stored game state.
# An example of this is when drawing cards.
def handle_powerup(db: SessionDep, powerup: PowerUp, team: Team):
    if powerup.description == "Draw a Card.":
        team.challenges += 1

    db.add(team)
    db.commit()
    db.refresh(team)