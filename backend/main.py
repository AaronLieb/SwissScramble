import logging

from fastapi import FastAPI

from .database.database import create_db_and_tables
from .auth.api import router as auth_router
from .game.api import router as game_router

logging.basicConfig(
    level=logging.INFO,
    filename="app.log",
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logging.getLogger("passlib").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)


app = FastAPI()
app.include_router(auth_router)
app.include_router(game_router)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
