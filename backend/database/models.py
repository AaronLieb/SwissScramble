import datetime
from sqlmodel import Relationship, SQLModel, Field


class GameBase(SQLModel):
    active: bool
    day: int
    start: datetime.datetime
    end: datetime.datetime
    day_start: datetime.time
    day_end: datetime.time
    passive_income_enabled: bool
    multiplier: int


class Game(GameBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class GameCreate(GameBase):
    pass


class TeamBase(SQLModel):
    name: str = Field(index=True)
    money: int = Field(default=0)
    score: int = Field(default=0)
    curses: int = Field(default=0)
    challenges: int = Field(default=0)
    income: int = Field(default=0)
    hand_size: int = Field(default=3)


class Team(TeamBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    users: list["User"] = Relationship(back_populates="team")
    cantons: list["Canton"] = Relationship(back_populates="team")


class TeamUpdate(TeamBase):
    name: str | None  # pyright:ignore
    money: int | None  # pyright:ignore
    score: int | None  # pyright:ignore
    curses: int | None  # pyright:ignore
    challenges: int | None  # pyright:ignore
    income: int | None  # pyright:ignore
    hand_size: int | None  # pyright:ignore


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


class CantonBase(SQLModel):
    name: str = Field(unique=True)
    value: int = Field(default=1)
    level: int = Field(default=0)
    destroyed: bool = Field(default=False)
    team_id: int | None = Field(default=None, foreign_key="team.id")


class Canton(CantonBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

    team: Team | None = Relationship(back_populates="cantons")


class CantonUpdate(CantonBase):
    name: str | None  # pyright:ignore
    value: int | None  # pyright:ignore
    level: int | None  # pyright:ignore
    destroyed: bool | None  # pyright:ignore


class EnterCantonPost(SQLModel):
    id: int | None = Field(default=None)


class DestroyCantonPost(SQLModel):
    id: int | None = Field(default=None)


class EventBase(SQLModel):
    source: str | None
    text: str
    time: datetime.datetime
    # location: Location | None


class Event(EventBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class EventPost(SQLModel):
    text: str


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
    multiplier: int


class BuyCursePost(CurseBase):
    pass


class UseCursePost(CurseBase):
    pass


class PowerUpBase(SQLModel):
    name: str
    description: str
    cost: int


class PowerUp(PowerUpBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    multiplier: float


class BuyPowerUpPost(PowerUpBase):
    id: int | None
