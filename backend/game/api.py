from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import select

from backend.database.database import SessionDep

from ..database.models import Canton, Team, User as DbUser
from .models import User
from ..auth import auth

router = APIRouter()


@router.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    return current_user


@router.get("/money/me")
async def read_own_items(
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    return [{"money": 500, "owner": current_user.username}]


@router.get("/cantons/")
async def read_cantons(db: SessionDep):
    return db.exec(select(Canton)).all()


@router.get("/teams/")
async def read_teams(db: SessionDep):
    return db.exec(select(Team)).all()


@router.get("/users/")
async def read_users(db: SessionDep):
    return db.exec(select(DbUser)).all()
