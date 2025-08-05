import subprocess

def ping_device(ip: str, count: int = 2, timeout: int = 2) -> dict:
    try:
        result = subprocess.run(
            ["ping", "-c", str(count), "-W", str(timeout), ip],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )
        success = result.returncode == 0
        return {
            "success": success,
            "output": result.stdout,
            "error": result.stderr if not success else ""
        }
    except Exception as e:
        return {"success": False, "error": str(e)}