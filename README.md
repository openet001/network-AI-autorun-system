# 智能化网络设备与Windows/Linux服务器运维平台
# network-ServerAI-autorun-system

## 平台说明

本平台集自然语言AI、网络设备、Windows/Linux服务器和VMware虚拟机于一体，自动化运维能力强大，适合企业自运维及二次开发。
一个基于 FastAPI + SQLAlchemy + PostgreSQL 的智能网络自动化运维平台，支持设备管理、批量命令、联机检测、用户认证/权限、定时任务等。

支持**网络设备自动化运维、批量操作、设备联机检测、日志追踪、用户权限管理**的全栈平台。  
前端基于 **Vite + React + Ant Design**，后端基于 **FastAPI + SQLAlchemy + PostgreSQL**。  
适配 Ubuntu 22.04 LTS，适合企业/实验室智能运维场景。


## 主要特性
- 设备CRUD、批量命令、Ping联机检测、操作日志
- 用户注册/登录，JWT认证，角色权限隔离
- APScheduler定时任务
- 自动API文档


## 目录结构
```
network-AI-autoyun-system/
├── backend/                      # 后端根目录
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI 入口
│   │   ├── database.py           # 数据库连接
│   │   ├── models.py             # SQLAlchemy模型
│   │   ├── schemas.py            # Pydantic数据结构
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── ai.py
│   │   │   ├── auth.py           # 用户认证与权限
│   │   │   ├── network.py        # 设备/批量/Ping/日志接口
│   │   │   ├── server.py
│   │   │   └── vmware.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── ai.py
│   │   │   ├── server.py
│   │   │   ├── vmware.py
│   │   │   └── network/
│   │   │       ├── __init__.py
│   │   │       ├── autodetect.py
│   │   │       ├── cisco.py
│   │   │       ├── arista.py
│   │   │       ├── juniper.py
│   │   │       ├── huawei.py
│   │   │       ├── h3c.py
│   │   │       ├── f5.py
│   │   │       ├── generic.py
│   │   │       └── ping.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── security.py       # 密码hash/校验
│   │       └── scheduler.py      # 定时任务
│   ├── db/
│   │   └── schema.sql            # 数据库建表SQL
│   ├── .env                      # 数据库连接配置
│   └── requirements.txt          # 后端依赖
└── network-ai-frontend/          # 前端根目录
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── README.md
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        ├── auth.js
        ├── components/
        │   └── PrivateRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── DeviceList.jsx
        │   ├── DeviceDetail.jsx
        │   ├── BatchExec.jsx
        │   ├── Logs.jsx
        │   └── NotFound.jsx
        └── assets/
            └── (可选图片/样式等)
```



## Ubuntu 22.04 安装步骤

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql postgresql-contrib

# 配置数据库
sudo -u postgres psql
-- 在psql终端:
CREATE USER netaiuser WITH PASSWORD 'yourpassword';
CREATE DATABASE netaiplat OWNER netaiuser;
GRANT ALL PRIVILEGES ON DATABASE netaiplat TO netaiuser;
\q

# 克隆代码&安装依赖
git clone https://github.com/openet001/network-AI-autorun-system.git
cd network-AI-autoyun-system
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 初始化表结构
psql -U netaiuser -d netaiplat -f db/schema.sql

# 如遇表权限错误，执行下列SQL(以postgres身份)
sudo -u postgres psql -d netaiplat
DO $$ DECLARE r RECORD; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO netaiuser;'; END LOOP; END $$;
DO $$ DECLARE r RECORD; BEGIN FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP EXECUTE 'ALTER SEQUENCE public.' || quote_ident(r.sequence_name) || ' OWNER TO netaiuser;'; END LOOP; END $$;
\q

# 配置.env
echo "DATABASE_URL=postgresql+psycopg2://netaiuser:yourpassword@localhost:5432/netaiplat" > .env

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 访问API文档: http://localhost:8000/docs


```

## 依赖
见 requirements.txt

## 常见问题
- 权限不足：请确保表/序列的owner都是netaiuser
- Pydantic警告：将orm_mode=True改为from_attributes=True
- 密码加密使用passlib[bcrypt]，jwt用python-jose
- 定时任务启动无需额外操作

### 4. 配置环境变量

编辑 `.env` 文件，填入数据库、OpenAI、VMware等密钥。

### 5. 启动服务

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## AI大模型支持
- OpenAI gpt-3.5-turbo
- DeepSeek
- 豆包（BigModel）  
接口任选，调用格式见`/ai/ask`接口，参数model可为openai、deepseek、doubot。

## 网络设备支持
- Cisco: IOS, IOS-XE, IOS-XR, NX-OS, WLC, ASA/FTD
- Juniper: JunOS
- Arista: EOS
- F5: BIG-IP
- Huawei/H3C: 交换机、路由器、防火墙
- 自动识别设备类型，自动适配命令执行

...

## API接口说明

- `/ai/ask`      -- 问AI助手
- `/network/devices/` -- 管理网络设备
- `/network/command/` -- 网络设备命令
- `/server/linux/`    -- Linux服务器命令
- `/server/windows/`  -- Windows服务器命令
- `/vmware/listvms/`  -- 列出VMware虚拟机

## 二次开发建议

- 集成LDAP/AD，完善权限管理。
- 增加作业调度、运维编排、告警联动。
- 拓展支持Kubernetes、Docker等云原生环境。
- 前端可用React、Vue等开发，直接调用API即可。

【修订】
- ## Ubuntu 22.04 安装步骤

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql postgresql-contrib

# 配置数据库
sudo -u postgres psql
-- 在psql终端:
CREATE USER netaiuser WITH PASSWORD 'yourpassword';
CREATE DATABASE netaiplat OWNER netaiuser;
GRANT ALL PRIVILEGES ON DATABASE netaiplat TO netaiuser;
\q

# 克隆代码&安装依赖
git clone https://github.com/openet001/network-AI-autoyun-system.git
cd network-AI-autoyun-system
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 初始化表结构
psql -U netaiuser -d netaiplat -f db/schema.sql

# 如遇表权限错误，执行下列SQL(以postgres身份)
sudo -u postgres psql -d netaiplat
DO $$ DECLARE r RECORD; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO netaiuser;'; END LOOP; END $$;
DO $$ DECLARE r RECORD; BEGIN FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public' LOOP EXECUTE 'ALTER SEQUENCE public.' || quote_ident(r.sequence_name) || ' OWNER TO netaiuser;'; END LOOP; END $$;
\q

# 配置.env
echo "DATABASE_URL=postgresql+psycopg2://netaiuser:yourpassword@localhost:5432/netaiplat" > .env

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 访问API文档: http://localhost:8000/docs
```


## 前端部署：
```
办法（适用于 Ubuntu 22.04 LTS）
 卸载所有旧的 node/nodejs/nodesource 相关包
bash
sudo apt-get remove --purge nodejs npm libnode-dev -y
sudo apt-get autoremove -y
sudo rm -rf /usr/lib/node_modules
sudo rm -rf /usr/include/node
sudo rm -rf /usr/bin/node /usr/bin/npm
sudo rm -rf /usr/local/bin/node /usr/local/bin/npm
sudo rm -rf ~/.npm ~/.nvm ~/.node-gyp
 确认 node/npm 已被卸载
bash
node -v
npm -v
都应提示 not found
 重新添加 NodeSource 源并安装 Node.js 20.x
bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
 检查 node/npm 版本
bash
node -v    # 应输出 v20.x.x
npm -v     # 应输出 10.x.x 或更高
（可选）升级 npm 到最新版
bash
sudo npm install -g npm@latest
创建 Vite+React 项目
bash
npm create vite@latest network-ai-frontend -- --template react
cd network-ai-frontend
npm install
npm install antd axios react-router-dom
npm run dev

（ or npm run dev -- --host 0.0.0.0  # allow  lan access url )
```

要点：libnode-dev（12.x）与新 nodejs 包有冲突，不清理干净安装不了新版。
解决方案：彻底卸载旧 node 相关包和残留文件，然后再装新版。
终端会输出本地访问地址，通常是 http://localhost:5173
 
确保后端允许 CORS
确保后端 FastAPI 添加了如下内容（否则前端无法请求后端）：
```
Python 
from fastapi.middleware.cors import
 CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
"*"], # 或填写你的前端地址
    allow_credentials=
True
,
    allow_methods=[
"*"
],
    allow_headers=[
"*"
],
)
```
 
8. (可选) 打包发布
```
bash 
 
npm run build

```
# 构建后的静态文件在 dist/ 目录


## 依赖
见 requirements.txt

## 常见问题
- 权限不足：请确保表/序列的owner都是netaiuser
- Pydantic警告：将orm_mode=True改为from_attributes=True
- 密码加密使用passlib[bcrypt]，jwt用python-jose
- 定时任务启动无需额外操作

## 技术交流群

如需源码、定制开发、技术支持可联系作者：847297@qq.com

