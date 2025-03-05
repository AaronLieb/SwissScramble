from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
import sqlite3

from ..config import settings


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    load_default_data()

def load_default_data():
    with open('scripts/load-data.sql', 'r') as sql_file:
        sql_script = sql_file.read()

        db = sqlite3.connect('main.db')
        cursor = db.cursor()
        cursor.executescript(sql_script)
        db.commit()
        db.close()

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

sqlite_file_name = settings.dbname
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)
