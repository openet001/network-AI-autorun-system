from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String(16), default="operator")

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=True, nullable=False)
    ip = Column(String(32), unique=True, nullable=False)
    type = Column(String(32), nullable=False)
    vendor = Column(String(32), nullable=False)
    username = Column(String(64))
    password = Column(String(128))
    create_time = Column(TIMESTAMP)

    logs = relationship("OperationLog", back_populates="device")

class OperationLog(Base):
    __tablename__ = "operation_logs"
    id = Column(Integer, primary_key=True, index=True)
    operator = Column(String(64))
    device_id = Column(Integer, ForeignKey("devices.id"))
    operation = Column(Text)
    result = Column(Text)
    timestamp = Column(TIMESTAMP)

    device = relationship("Device", back_populates="logs")