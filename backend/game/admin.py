from fastapi import APIRouter

from .income import give_income, set_time_stopped

from ..database.database import SessionDep

router = APIRouter(prefix="/admin")


@router.get("/stop_time/")
async def stop_time():
    set_time_stopped(True)


@router.get("/start_time/")
async def start_time():
    set_time_stopped(False)


@router.get("/give_income/")
async def income(db: SessionDep):
    give_income(db)
