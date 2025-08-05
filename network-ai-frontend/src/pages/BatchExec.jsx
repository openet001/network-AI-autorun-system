import { useEffect, useState } from "react";
import { Card, Select, Input, Button, List, message } from "antd";
import api from "../api";

export default function BatchExec() {
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [command, setCommand] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/network/devices/").then(res => setDevices(res.data));
  }, []);

  const handleExec = async () => {
    if (!command || selected.length === 0) {
      message.warning("请选择设备并输入命令");
      return;
    }
    setResults([]);
    try {
      const res = await api.post("/network/devices/batch_exec", {
        devices: selected,
        command
      });
      setResults(res.data);
      message.success("批量命令已下发");
    } catch (e) {
      message.error("批量执行失败");
    }
  };

  return (
    <Card title="批量命令下发">
      <div style={{marginBottom: 12}}>
        <span>设备选择：</span>
        <Select
          mode="multiple"
          style={{width: 400}}
          placeholder="请选择设备"
          value={selected}
          onChange={setSelected}
          options={devices.map(d=>({label: `${d.name}(${d.ip})`, value: d.id}))}
        />
      </div>
      <div style={{marginBottom: 12}}>
        <span>命令：</span>
        <Input 
          style={{width: 400}} 
          value={command}
          onChange={e=>setCommand(e.target.value)}
          placeholder="如 show version"
        />
        <Button type="primary" style={{marginLeft: 10}} onClick={handleExec}>执行</Button>
      </div>
      <List
        size="small"
        header={results.length>0 && "批量执行结果"}
        dataSource={results}
        renderItem={item=>(
          <List.Item>
            <div>
              <b>设备ID {item.device_id}</b>：{item.result}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}