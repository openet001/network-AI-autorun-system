import { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../api";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/network/logs/").then(res => setLogs(res.data));
  }, []);

  return (
    <Table
      dataSource={logs}
      rowKey="id"
      columns={[
        {title: "ID", dataIndex: "id", width: 60},
        {title: "设备ID", dataIndex: "device_id"},
        {title: "操作人", dataIndex: "operator"},
        {title: "操作内容", dataIndex: "operation"},
        {title: "执行结果", dataIndex: "result"},
        {title: "时间", dataIndex: "timestamp", render: v=>v?.slice(0,19).replace("T"," ")}
      ]}
    />
  );
}