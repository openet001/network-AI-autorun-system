CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    hashed_password VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(16) DEFAULT 'operator'
);

CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    ip VARCHAR(32) UNIQUE NOT NULL,
    type VARCHAR(32) NOT NULL,
    vendor VARCHAR(32) NOT NULL,
    username VARCHAR(64),
    password VARCHAR(128),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operation_logs (
    id SERIAL PRIMARY KEY,
    operator VARCHAR(64),
    device_id INTEGER REFERENCES devices(id),
    operation TEXT,
    result TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);