from typing import Annotated, Sequence
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from ..database.database import SessionDep
from ..database.models import (
    Canton,
    Challenge,
    ChallengePost,
    Event,
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

    if team is None:
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

    db.add(team)
    db.commit()
    db.refresh(team)

    db.add(canton)
    db.commit()
    db.refresh(canton)

    return {"team": team, "canton": canton}
