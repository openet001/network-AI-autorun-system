from apscheduler.schedulers.background import BackgroundScheduler
from app.database import SessionLocal
from app.models import Device
from app.services.network.ping import ping_device

def scheduled_ping():
    db = SessionLocal()
    devices = db.query(Device).all()
    for device in devices:
        result = ping_device(device.ip)
        print(f"[Scheduler] Ping {device.name}({device.ip}): {result['success']}")
    db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduled_ping, "interval", minutes=10, id="ping_all_devices", replace_existing=True)
    scheduler.start()
    print("Scheduler started.")