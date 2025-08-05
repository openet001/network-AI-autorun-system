import { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select, Space } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/network/devices/");
      setDevices(res.data);
    } catch (e) {
      message.error("获取设备列表失败");
    }
    setLoading(false);
  };

  useEffect(() => { fetchDevices(); }, []);

  const handleAdd = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    try {
      await api.post("/network/devices/", values);
      message.success("添加成功");
      setModalOpen(false);
      fetchDevices();
    } catch (e) {
      message.error(e.response?.data?.detail || "添加失败");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除？",
      onOk: async () => {
        try {
          await api.delete(`/network/devices/${id}`);
          message.success("删除成功");
          fetchDevices();
        } catch (e) {
          message.error("删除失败");
        }
      }
    });
  };

  const handlePing = async (id) => {
    message.loading({content: "正在检测...", key: "ping"});
    try {
      const res = await api.post(`/network/devices/${id}/ping`);
      if (res.data.success) {
        message.success({content: "设备在线", key: "ping"});
      } else {
        message.error({content: "设备不通", key: "ping"});
      }
    } catch (e) {
      message.error({content: "检测失败", key: "ping"});
    }
  };

  return (
    <div>
      <Space style={{marginBottom: 16}}>
        <Button type="primary" onClick={handleAdd}>添加设备</Button>
      </Space>
      <Table 
        dataSource={devices} 
        rowKey="id"
        loading={loading}
        columns={[
          {title: "名称", dataIndex: "name"},
          {title: "IP地址", dataIndex: "ip"},
          {title: "类型", dataIndex: "type"},
          {title: "厂商", dataIndex: "vendor"},
          {title: "用户名", dataIndex: "username"},
          {title: "创建时间", dataIndex: "create_time", render: v=>v?.slice(0,19).replace("T"," ")},
          {
            title: "操作",
            render: (_, record) => (
              <Space>
                <Button size="small" onClick={()=>navigate(`/device/${record.id}`)}>详情</Button>
                <Button size="small" onClick={()=>handlePing(record.id)}>联机检测</Button>
                <Button size="small" danger onClick={()=>handleDelete(record.id)}>删除</Button>
              </Space>
            )
          }
        ]}
      />

      <Modal title="添加设备" open={modalOpen} onCancel={()=>setModalOpen(false)} onOk={handleModalOk}>
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="name" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item label="IP地址" name="ip" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{required: true}]}>
            <Select options={[
              {label: "交换机", value: "switch"},
              {label: "路由器", value: "router"},
              {label: "防火墙", value: "firewall"},
              {label: "其它", value: "other"},
            ]}/>
          </Form.Item>
          <Form.Item label="厂商" name="vendor" rules={[{required: true}]}>
            <Select options={[
              {label: "Cisco", value: "cisco"},
              {label: "Juniper", value: "juniper"},
              {label: "Arista", value: "arista"},
              {label: "Huawei", value: "huawei"},
              {label: "H3C", value: "h3c"},
              {label: "F5", value: "f5"},
              {label: "其它", value: "other"},
            ]}/>
          </Form.Item>
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}