# 在D盘创建项目目录
$repoName = "network-AI-autoyun-system"
$localPath = "D:\$repoName"
$githubUser = "openet001"  # 替换为你的GitHub用户名
$githubUrl = "git@github.com:$githubUser/$repoName.git"

# 1. 创建主目录
New-Item -Path $localPath -ItemType Directory -Force

# 2. 创建目录结构
$dirs = @(
    "app",
    "app\routers",
    "app\services",
    "app\utils",
    "db"
)
foreach ($dir in $dirs) { New-Item -Path "$localPath\$dir" -ItemType Directory -Force }

# 3. 写入文件内容
function Write-ProjectFile($relativePath, $content) {
    $fullPath = Join-Path $localPath $relativePath
    Set-Content -Path $fullPath -Value $content -Encoding UTF8
}

# 4. 填充所有文件（省略重复，以下为示例，剩余文件见前述代码块，依次填充即可）
Write-ProjectFile "app\__init__.py" ""
Write-ProjectFile "app\main.py" @'
from fastapi import FastAPI
from app.routers import ai, network, server, vmware
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="智能化网络与服务器运维平台",
    description="基于自然语言的自动化运维与集成平台",
    version="1.0.0"
)

app.include_router(ai.router, prefix="/ai", tags=["AI助手"])
app.include_router(network.router, prefix="/network", tags=["网络设备"])
app.include_router(server.router, prefix="/server", tags=["服务器"])
app.include_router(vmware.router, prefix="/vmware", tags=["VMware"])
'@
# ... 依次写入所有文件，参考上述完整文件内容

# 示例：写入README
Write-ProjectFile "README.md" @'
# 智能化网络与Windows/Linux运维平台

## 平台说明
本平台集自然语言AI、网络设备、Windows/Linux服务器和VMware虚拟机于一体，自动化运维能力强大，适合企业自运维及二次开发。
...
'@
# 依次写入所有py、sql、env、requirements.txt等（可参考前述全部内容）

# 5. 初始化git仓库并推送
Set-Location $localPath
git init
git remote add origin $githubUrl
git add .
git commit -m "init: 项目首次提交"
git branch -M main
git push -u origin main

Write-Host "代码已完成创建并推送至 $githubUrl"