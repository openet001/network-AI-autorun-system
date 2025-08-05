import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Input, message, List, Typography } from "antd";
import api from "../api";

export default function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [cmd, setCmd] = useState("");
  const [cmdResult, setCmdResult] = useState("");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get(`/network/devices/${id}`).then(res => setDevice(res.data));
    api.get(`/network/logs?device_id=${id}`).then(res => setLogs(res.data));
  }, [id]);

  const handleExec = async () => {
    if (!cmd) return;
    setCmdResult("正在执行...");
    try {
      const res = await api.post(`/network/devices/${id}/exec`, {command: cmd});
      setCmdResult(res.data.result);
      message.success("命令已下发");
      // 刷新日志
      api.get(`/network/logs?device_id=${id}`).then(res => setLogs(res.data));
    } catch (e) {
      setCmdResult("命令执行失败");
    }
  };

  if (!device) return null;

  return (
    <div>
      <Card title={`设备详情: ${device.name}`} style={{marginBottom: 24}}>
        <p>IP地址: {device.ip}</p>
        <p>类型: {device.type}</p>
        <p>厂商: {device.vendor}</p>
        <p>用户名: {device.username}</p>
        <p>创建时间: {device.create_time?.slice(0,19).replace("T"," ")}</p>
      </Card>
      <Card title="命令下发" style={{marginBottom: 24}}>
        <Input.Group compact>
          <Input 
            style={{width: 400}} 
            value={cmd} 
            onChange={e=>setCmd(e.target.value)} 
            placeholder="请输入命令, 如 show version"
            onPressEnter={handleExec}
          />
          <Button type="primary" onClick={handleExec}>执行</Button>
        </Input.Group>
        <Typography.Paragraph copyable={{text: cmdResult}} style={{marginTop: 16}}>{cmdResult}</Typography.Paragraph>
      </Card>
      <Card title="操作日志">
        <List
          dataSource={logs}
          renderItem={item=>(
            <List.Item>
              <div>
                <div><b>{item.operation}</b></div>
                <div style={{fontSize:12, color:"#888"}}>{item.timestamp?.slice(0,19).replace("T"," ")} by {item.operator}</div>
                <Typography.Paragraph style={{margin:0}} copyable={{text: item.result}}>{item.result}</Typography.Paragraph>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}