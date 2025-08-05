from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["ai"])

@router.get("/ping")
def ping():
    return {"msg": "AI module healthy"}