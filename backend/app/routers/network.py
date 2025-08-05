from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import schemas, models
from app.services.network import (
    autodetect, cisco, juniper, arista, huawei, h3c, f5, generic, ping as ping_service
)
from app.routers.auth import get_current_user, require_admin

router = APIRouter(prefix="/network", tags=["network"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/devices/", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db), user=Depends(require_admin)):
    db_device = db.query(models.Device).filter(models.Device.ip == device.ip).first()
    if db_device:
        raise HTTPException(status_code=400, detail="Device already registered")
    new_device = models.Device(**device.model_dump())
    db.add(new_device)
    db.commit()
    db.refresh(new_device)
    return new_device

@router.get("/devices/", response_model=list[schemas.Device])
def list_devices(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.Device).all()

@router.get("/devices/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.delete("/devices/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db), user=Depends(require_admin)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    db.delete(device)
    db.commit()
    return {"msg": "Device deleted"}

@router.post("/devices/{device_id}/exec")
def exec_command(device_id: int, cmd: dict = Body(...), db: Session = Depends(get_db), user=Depends(get_current_user)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    vendor = device.vendor.lower()
    command = cmd.get("command")
    if not command:
        raise HTTPException(status_code=400, detail="Command missing")
    if vendor == "cisco":
        result = cisco.run_command(device.ip, command)
    elif vendor == "juniper":
        result = juniper.run_command(device.ip, command)
    elif vendor == "arista":
        result = arista.run_command(device.ip, command)
    elif vendor == "huawei":
        result = huawei.run_command(device.ip, command)
    elif vendor == "h3c":
        result = h3c.run_command(device.ip, command)
    elif vendor == "f5":
        result = f5.run_command(device.ip, command)
    else:
        result = generic.run_command(device.ip, command)
    log = models.OperationLog(
        operator=user.username,
        device_id=device_id,
        operation=command,
        result=result
    )
    db.add(log)
    db.commit()
    return {"result": result}

@router.post("/devices/batch_exec")
def batch_exec(
    devices: list[int] = Body(...), 
    command: str = Body(...), 
    db: Session = Depends(get_db), 
    user=Depends(get_current_user)
):
    results = []
    for device_id in devices:
        device = db.query(models.Device).filter(models.Device.id == device_id).first()
        if not device:
            results.append({"device_id": device_id, "result": "Device not found"})
            continue
        vendor = device.vendor.lower()
        runner = {
            "cisco": cisco.run_command,
            "juniper": juniper.run_command,
            "arista": arista.run_command,
            "huawei": huawei.run_command,
            "h3c": h3c.run_command,
            "f5": f5.run_command
        }.get(vendor, generic.run_command)
        try:
            output = runner(device.ip, command)
            results.append({"device_id": device_id, "result": output})
            log = models.OperationLog(
                operator=user.username,
                device_id=device_id,
                operation=command,
                result=output
            )
            db.add(log)
        except Exception as e:
            results.append({"device_id": device_id, "result": str(e)})
    db.commit()
    return results

@router.post("/devices/{device_id}/ping")
def ping_device(device_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    result = ping_service.ping_device(device.ip)
    return result

@router.get("/logs/", response_model=list[schemas.OperationLog])
def get_logs(device_id: int = None, db: Session = Depends(get_db), user=Depends(get_current_user)):
    query = db.query(models.OperationLog)
    if device_id:
        query = query.filter(models.OperationLog.device_id == device_id)
    return query.order_by(models.OperationLog.timestamp.desc()).all()