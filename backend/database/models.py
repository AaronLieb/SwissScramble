from datetime import datetime
from sqlmodel import Relationship, SQLModel, Field


class Game(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    active: bool
    start_time: datetime
    end_time: datetime


class Team(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    money: int = Field(default=0)
    score: int = Field(default=0)

    users: list["User"] = Relationship(back_populates="team")
    cantons: list["Canton"] = Relationship(back_populates="team")


class UserBase(SQLModel):
    username: str = Field(default=None, primary_key=True)
    firstname: str | None
    lastname: str | None


class User(UserBase, table=True):
    hashed_password: str | None = Field(default=None)
    team_id: int | None = Field(default=None, foreign_key="team.id")

    team: Team | None = Relationship(back_populates="users")


class UserPublic(UserBase):
    team_id: int | None


class Canton(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    value: int = Field(default=1)
    level: int = Field(default=0)
    team_id: int | None = Field(default=None, foreign_key="team.id")
    destroyed: bool = Field(default=False)

    team: Team | None = Relationship(back_populates="cantons")


# class Ping


class Event(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    source: str | None
    text: str
    time: datetime
    # Location


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


class Curse(CurseBase):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    cost: int


class BuyCursePost(CurseBase):
    pass


class PowerUpBase(SQLModel):
    id: int | None = Field(default=None, primary_key=True)


class PowerUp(PowerUpBase):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    description: str
    cost: int


class BuyPowerUpPost(CurseBase):
    pass
