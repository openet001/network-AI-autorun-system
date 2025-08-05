from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    model_config = {"from_attributes": True}

class DeviceBase(BaseModel):
    name: str
    ip: str
    type: str
    vendor: str
    username: Optional[str] = None
    password: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int
    create_time: Optional[datetime]
    model_config = {"from_attributes": True}

class OperationLogBase(BaseModel):
    operator: Optional[str]
    device_id: int
    operation: str
    result: Optional[str] = None

class OperationLogCreate(OperationLogBase):
    pass

class OperationLog(OperationLogBase):
    id: int
    timestamp: Optional[datetime]
    model_config = {"from_attributes": True}