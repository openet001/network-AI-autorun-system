import paramiko
from app.models import Device

def ssh_exec_command(device: Device, command: str) -> str:
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=device.ip, username=device.username, password=device.password, timeout=10)
        stdin, stdout, stderr = ssh.exec_command(command)
        result = stdout.read().decode() + stderr.read().decode()
        ssh.close()
        return result
    except Exception as e:
        return f"SSH Error: {str(e)}"