from typing import Annotated, Sequence
from fastapi import APIRouter, Depends
from sqlmodel import select

from ..database.database import SessionDep
from ..database.models import User, UserPublic
from ..auth import auth

router = APIRouter(prefix="/admin")


@router.get("/user/", response_model=UserPublic)
async def read_user(
    current_user: Annotated[User, Depends(auth.get_current_user)],
):
    return current_user


@router.get("/users/", response_model=Sequence[UserPublic])
async def read_users(db: SessionDep):
    return db.exec(select(User)).all()
