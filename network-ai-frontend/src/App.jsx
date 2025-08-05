import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useState } from "react";
import Login from "./pages/Login";
import DeviceList from "./pages/DeviceList";
import DeviceDetail from "./pages/DeviceDetail";
import BatchExec from "./pages/BatchExec";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { isAuthenticated, logout } from "./auth";

const { Header, Content, Footer } = Layout;

export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  const handleLogout = () => {
    logout();
    setAuth(false);
    window.location.href = "/login";
  };

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{display: "flex", alignItems: "center"}}>
          <div style={{flex: 1, color: "#fff", fontWeight: "bold"}}>Network AI Autoyun System</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["devices"]}
            selectable={false}
            style={{minWidth: 300}}
            items={[
              { key: "devices", label: <Link to="/">设备管理</Link> },
              { key: "batch", label: <Link to="/batch">批量操作</Link> },
              { key: "logs", label: <Link to="/logs">操作日志</Link> },
              { key: "logout", label: auth ? <span onClick={handleLogout}>退出</span> : <Link to="/login">登录</Link> }
            ]}
          />
        </Header>
        <Content style={{padding: "24px"}}>
          <Routes>
            <Route path="/login" element={<Login onLogin={()=>setAuth(true)}/>} />
            <Route path="/" element={<PrivateRoute><DeviceList /></PrivateRoute>} />
            <Route path="/device/:id" element={<PrivateRoute><DeviceDetail /></PrivateRoute>} />
            <Route path="/batch" element={<PrivateRoute><BatchExec /></PrivateRoute>} />
            <Route path="/logs" element={<PrivateRoute><Logs /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
        <Footer style={{textAlign: "center"}}>Network AI Autoyun System ©2025</Footer>
      </Layout>
    </Router>
  );
}