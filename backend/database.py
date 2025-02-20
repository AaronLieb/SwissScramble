from typing import Annotated
from fastapi import Depends
from sqlmodel import Field, Session, SQLModel, create_engine, select


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


class DbUser(SQLModel, table=True):
    username: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field(default=None)


class DbTeam(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)
    money: int = Field(default=0)
    score: int = Field(default=0)


class DbCanton(SQLModel, table=True):
    name: str = Field(default=None, primary_key=True)
    value: int = Field(default=1)
    level: int = Field(default=0)
    team: DbTeam | None = Field(default=None)
