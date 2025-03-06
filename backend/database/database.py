from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
import sqlite3
import csv

from ..config import settings
from .models import Challenge, Curse

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    load_default_data()
    load_challenges(engine)
    load_curses(engine)

def load_default_data():
    with open('scripts/load-data.sql', 'r') as sql_file:
        sql_script = sql_file.read()

        db = sqlite3.connect('main.db')
        cursor = db.cursor()
        cursor.executescript(sql_script)
        db.commit()
        db.close()

def load_challenges(engine):
    challenges = []
    with open('database/challenges.tsv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
        next(reader) # Discard the header line.
        for row in reader:
            level = 0 if row[2] == '' else int(row[2])
            money = 0 if row[3] == '' else int(row[3])
            challenges.append(Challenge(name=row[0], description=row[1], levels=level, money=money))

    with Session(engine) as session:
        for c in challenges:
            session.add(c)
            session.commit()

def load_curses(engine):
    curses = []
    with open('database/curses.tsv', newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter='\t', quotechar='"')
        next(reader) # Discard the header line.
        for row in reader:
            curses.append(Curse(name=row[0], description=row[1], cost=100)) # Curses all cost 100 money.

    with Session(engine) as session:
        for c in curses:
            session.add(c)
            session.commit()

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

sqlite_file_name = settings.dbname
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)
