from datetime import datetime
from typing import Annotated, Sequence
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from ..database.database import SessionDep
from ..database.models import (
    BuyCursePost,
    BuyPowerUpPost,
    Canton,
    Challenge,
    ChallengePost,
    Curse,
    Event,
    PowerUp,
    Team,
    User,
    UserPublic,
)
from ..auth import auth

router = APIRouter()


@router.get("/user/", response_model=UserPublic)
async def read_user(
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    return current_user


@router.get("/team/")
async def read_team(
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    user = db.get(User, current_user.username)
    if user:
        return user.team
    return None


@router.get("/cantons/")
async def read_cantons(db: SessionDep):
    return db.exec(select(Canton)).all()


@router.get("/teams/")
async def read_teams(db: SessionDep):
    return db.exec(select(Team)).all()


@router.get("/users/", response_model=Sequence[UserPublic])
async def read_users(db: SessionDep):
    return db.exec(select(Event)).all()


@router.get("/events/")
async def read_events(db: SessionDep):
    return db.exec(select(Event)).all()


@router.get("/challenges/")
async def read_challenges(db: SessionDep):
    return db.exec(select(Challenge)).all()


@router.post("/challenge/")
async def post_challenge(
    challenge: ChallengePost,
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    challenge_db = db.get(Challenge, challenge.id)

    if challenge_db is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Challenge ID",
        )

    team = current_user.team

    if team is None or team.id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not in team",
        )

    canton = db.get(Canton, challenge.canton)

    if canton is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Canton ID",
        )

    team.money += challenge_db.money

    other_team_id = 1 if team.id == 2 else 2
    other_team = db.get(Team, other_team_id)

    if canton.team == team:
        canton.level += challenge_db.levels
        canton.team = team
    elif canton.team is None:
        canton.level += challenge_db.levels
        canton.team = team
        team.score += canton.value
    else:
        if canton.level == challenge_db.levels:
            canton.team = None
        elif canton.level < challenge_db.levels:
            canton.team = team
            team.score += canton.value
        if other_team is not None:
            other_team.score -= canton.value
        canton.level = abs(canton.level - challenge_db.levels)

    canton.level = max(canton.level, 3)

    event = Event(
        text="Team '{0}' completed the challenge '{1}'".format(
            team.name, challenge_db.name
        ),
        source=team.name,
        time=datetime.now(),
    )

    db.add(team)
    db.commit()
    db.refresh(team)

    db.add(canton)
    db.commit()
    db.refresh(canton)

    db.add(event)
    db.commit()
    db.refresh(event)

    return {"team": team, "canton": canton}


@router.get("/curses/")
async def get_curses(
    db: SessionDep,
):
    return db.exec(select(Curse)).all()


@router.post("/curse/")
async def buy_curse(
    curse: BuyCursePost,
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    team = current_user.team

    if team is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Team",
        )

    curse_db = db.get(Curse, curse.id)

    if curse_db is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Curse",
        )

    if team.money < curse_db.cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient money",
        )

    team.money -= curse_db.cost

    db.add(team)
    db.commit()
    db.refresh(team)


@router.post("/powerup/")
async def buy_powerup(
    curse: BuyPowerUpPost,
    db: SessionDep,
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    team = current_user.team

    if team is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Team",
        )

    powerup_db = db.get(PowerUp, curse.id)

    if powerup_db is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Power Up",
        )

    if team.money < powerup_db.cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient money",
        )

    team.money -= powerup_db.cost

    db.add(team)
    db.commit()
    db.refresh(team)


@router.get("/powerups/")
async def get_powerups(
    db: SessionDep,
):
    return db.exec(select(PowerUp)).all()


@router.post("/enter_canton")
async def post_enter_canton(canton_id: int):
    print(canton_id)
    # edit number of cards in hand

    # pay tolls
    pass
