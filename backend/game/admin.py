from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import select

from ..auth import auth

from ..database.models import (
    Canton,
    CantonUpdate,
    Curse,
    Game,
    PowerUp,
    Team,
    TeamUpdate,
    User,
)
from .income import give_income
from ..database.database import SessionDep

router = APIRouter(prefix="/admin")


@router.patch("/canton/{canton_id}")
async def update_canton(
    canton_id: int,
    canton: CantonUpdate,
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    canton_db = db.get(Canton, canton_id)
    if not canton_id or canton_db is None:
        raise HTTPException(status_code=404, detail="canton not found")

    canton_data = canton.model_dump(exclude_unset=True)
    canton_db.sqlmodel_update(canton_data)
    db.add(canton_db)
    db.commit()
    db.refresh(canton_db)

    return canton_db


@router.patch("/team/{team_id}")
async def update_team(
    team_id: int,
    team: TeamUpdate,
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    team_db = db.get(Team, team_id)
    if not team_id or team_db is None:
        raise HTTPException(status_code=404, detail="Team not found")

    team_data = team.model_dump(exclude_unset=True)
    team_db.sqlmodel_update(team_data)
    db.add(team_db)
    db.commit()
    db.refresh(team_db)

    return team_db


@router.get("/stop_passive_income/")
async def stop_time(
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    game = db.get(Game, 1)

    if game is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to find Game"
        )

    game.passive_income_enabled = False

    db.add(game)
    db.commit()
    db.refresh(game)

    return game


@router.get("/start_passive_income/")
async def start_time(
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    game = db.get(Game, 1)

    if game is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to find Game"
        )

    game.passive_income_enabled = True

    db.add(game)
    db.commit()
    db.refresh(game)

    return game


@router.get("/give_income/")
async def income(
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    give_income(db)

class MultiplierItem(BaseModel):
    mult: int

@router.post("/set_multipliers/")
async def set_multipliers(
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
    multiplier: MultiplierItem
):
    if current_user.username != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    game = db.get(Game, 1)

    if game is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to find game.")

    game.multiplier = multiplier.mult
    db.add(game)
    db.commit()
    db.refresh(game)

    curses = db.exec(select(Curse)).all()
    powerups = db.exec(select(PowerUp)).all()

    for curse in curses:
        curse.multiplier = multiplier.mult
        db.add(curse)
        db.commit()
        db.refresh(curse)

    for powerup in powerups:
        powerup.multiplier = multiplier.mult
        db.add(powerup)
        db.commit()
        db.refresh(powerup)
