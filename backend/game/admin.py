from fastapi import APIRouter
from sqlmodel import select

from ..database.models import Game, PowerUp
from .income import give_income, set_time_stopped
from ..database.database import SessionDep

router = APIRouter(prefix="/admin")


@router.get("/stop_time/")
async def stop_time():
    set_time_stopped(True)


@router.get("/start_time/")
async def start_time():
    set_time_stopped(False)


@router.get("/give_income/")
async def income(db: SessionDep):
    give_income(db)


@router.get("/next_day/")
async def next_day(db: SessionDep):
    game = db.exec(select(Game)).all()[0]
    game.day += 1

    powerups = db.exec(select(PowerUp)).all()
    for powerup in powerups:
        if game.day == 2:
            powerup.cost *= 2
        if game.day == 3:
            powerup.cost = int(powerup.cost * 3 / 2)

        db.add(powerup)
        db.commit()
        db.refresh(powerup)

    db.add(game)
    db.commit()
    db.refresh(game)
