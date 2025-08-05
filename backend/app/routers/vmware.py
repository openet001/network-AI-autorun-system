from fastapi import APIRouter

router = APIRouter(prefix="/vmware", tags=["vmware"])

@router.get("/ping")
def ping():
    return {"msg": "VMware module healthy"}