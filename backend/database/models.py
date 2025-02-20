from sqlmodel import Relationship, SQLModel, Field


class Team(SQLModel, table=True):
    name: str = Field(primary_key=True)
    money: int = Field(default=0)
    score: int = Field(default=0)
    users: list["User"] = Relationship(back_populates="user")


class User(SQLModel, table=True):
    username: str = Field(primary_key=True)
    hashed_password: str = Field(default=None)
    team: Team | None = Relationship(back_populates="heroes")


class Canton(SQLModel, table=True):
    name: str = Field(primary_key=True)
    value: int = Field(default=1)
    level: int = Field(default=0)

    team: Team | None = Relationship(back_populates="team")
