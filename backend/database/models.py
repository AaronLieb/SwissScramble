from datetime import datetime
from sqlmodel import Relationship, SQLModel, Field


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
    team_name: str | None


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

    team_id: int | None = Field(default=None, foreign_key="team.id")
    team_name: str | None = Field(default=None, foreign_key="team.name")
    team: Team | None = Relationship(back_populates="users")


class UserPublic(UserBase):
    id: int


class Canton(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    value: int = Field(default=1)
    level: int = Field(default=0)

    team_name: str | None = Field(default=None, foreign_key="team.name")
    team: Team | None = Relationship(back_populates="cantons")
