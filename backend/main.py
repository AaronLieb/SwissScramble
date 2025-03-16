import logging
import schedule
import threading
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .game.income import give_income, is_time_stopped

from .database.database import create_db_and_tables, get_session
from .auth.api import router as auth_router
from .game.api import router as game_router
from .game.admin import router as admin_router

logging.basicConfig(
    level=logging.INFO,
    filename="app.log",
    filemode="a",
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logging.getLogger("passlib").setLevel(logging.ERROR)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()

    logger.info("Creating scheduler")
    schedule.every().hour.at(":00").do(hourly)
    stop_schedule_thread = start_schedule_thread()

    yield
    stop_schedule_thread.set()


app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)
app.include_router(game_router)
app.include_router(admin_router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def start_schedule_thread(interval=1):
    stop = threading.Event()

    class ScheduleThread(threading.Thread):
        def run(self):
            while not stop.is_set():
                schedule.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.start()
    return stop


def hourly():
    if not is_time_stopped():
        give_income(next(get_session()))
