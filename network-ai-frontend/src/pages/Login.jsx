import { useState } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import api from "../api";
import { setToken } from "../auth";

export default function Login({onLogin}) {
  const [loading, setLoading] = useState(false);

  const handleFinish = async ({username, password}) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/token", new URLSearchParams({username, password}));
      setToken(res.data.access_token);
      message.success("登录成功！");
      onLogin && onLogin();
      window.location.href = "/";
    } catch (e) {
      message.error("登录失败，请检查用户名或密码");
    }
    setLoading(false);
  };

  return (
    <div style={{display: "flex", height: "80vh", alignItems: "center", justifyContent: "center"}}>
      <Card title="用户登录" style={{width: 350}}>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item label="用户名" name="username" rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{required: true}]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary" style={{fontSize: 12}}>如首次使用，请联系管理员创建账号</Typography.Text>
      </Card>
    </div>
  );
}