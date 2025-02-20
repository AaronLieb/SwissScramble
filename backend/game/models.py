from pydantic import BaseModel


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
