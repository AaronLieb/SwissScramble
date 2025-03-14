from datetime import datetime
from sqlmodel import Relationship, SQLModel, Field


class GameBase(SQLModel):
    active: bool
    start_time: datetime
    end_time: datetime


class Game(GameBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class GameCreate(GameBase):
    pass


class GameUpdate:
    active: bool | None
    start_time: datetime | None
    end_time: datetime | None


class Team(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    money: int = Field(default=0)
    score: int = Field(default=0)

    users: list["User"] = Relationship(back_populates="team")
    cantons: list["Canton"] = Relationship(back_populates="team")


class UserBase(SQLModel):
    username: str = Field(index=True)
    firstname: str | None
    lastname: str | None


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str | None = Field(default=None)
    team_id: int | None = Field(default=None, foreign_key="team.id")

    team: Team | None = Relationship(back_populates="users")


class UserPublic(UserBase):
    id: int
    team_id: int | None


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    username: str
    firstname: str | None = None
    lastname: str | None = None
    password: str | None = None


class Canton(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    value: int = Field(default=1)
    level: int = Field(default=0)
    destroyed: bool = Field(default=False)
    team_id: int | None = Field(default=None, foreign_key="team.id")

    team: Team | None = Relationship(back_populates="cantons")


class EnterCantonPost(SQLModel):
    id: int | None = Field(default=None)


# class Ping


class EventBase(SQLModel):
    source: str | None
    text: str
    time: datetime
    # location: Location | None


class Event(EventBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class EventPost(EventBase):
    pass


class ChallengeBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)


class Challenge(ChallengeBase, table=True):
    name: str
    description: str
    levels: int = Field(default=1)
    money: int = Field(default=0)


class ChallengePost(ChallengeBase):
    canton: int = Field(foreign_key="canton.id")
    # Location


class CurseBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)


class Curse(CurseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    cost: int


class BuyCursePost(CurseBase):
    pass


class PowerUpBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)


class PowerUp(PowerUpBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    cost: int


class BuyPowerUpPost(PowerUpBase):
    pass
