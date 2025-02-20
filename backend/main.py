import logging

from typing import Annotated

from fastapi import Depends, FastAPI
from pydantic import BaseModel

from database import create_db_and_tables
from config import settings
from auth import get_current_user

logging.basicConfig(
    level=logging.INFO,
    filename="app.log",
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logging.getLogger("passlib").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)

# for testing purposes, will be removed later
users_db = {
    "team1": {
        "username": "team1",
        "hashed_password": settings.team1_hash,
    },
    "team2": {
        "username": "team2",
        "hashed_password": settings.team2_hash,
    },
}


class User(BaseModel):
    username: str


class Team(BaseModel):
    name: str
    money: int
    score: int


class Canton(BaseModel):
    name: str
    value: int
    level: int
    team: Team | None


app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user


@app.get("/money/me")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return [{"money": 500, "owner": current_user.username}]


# @app.get("/cantons/")
# async def read_cantons(
#     current_user: Annotated[User, Depends(get_current_user)],
# ):
#     return [{"money": 500, "owner": current_user.username}]
