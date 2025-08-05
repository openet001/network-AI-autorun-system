from fastapi import FastAPI
from app.routers import ai, network, server, vmware, auth
from app.database import engine, Base
from app.utils.scheduler import start_scheduler

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Network AI Autoyun System")

app.include_router(auth.router, prefix="/auth")
app.include_router(ai.router)
app.include_router(network.router)
app.include_router(server.router)
app.include_router(vmware.router)

@app.on_event("startup")
def on_startup():
    start_scheduler()