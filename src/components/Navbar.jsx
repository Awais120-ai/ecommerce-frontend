import { useState } from "react";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Grid,
} from "antd";

import {
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  OrderedListOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const { Header } = Layout;
const { useBreakpoint } = Grid;

function Navbar() {
  const screens = useBreakpoint();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
    window.location.reload();
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "3",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart">Cart</Link>,
    },
    {
      key: "4",
      icon: <HeartOutlined />,
      label: <Link to="/wishlist">Wishlist</Link>,
    },
    {
      key: "5",
      icon: <EnvironmentOutlined />,
      label: <Link to="/addresses">Addresses</Link>,
    },
    {
      key: "6",
      icon: <OrderedListOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
    isLoggedIn
      ? {
          key: "7",
          icon: <UserOutlined />,
          label: "Logout",
          onClick: handleLogout,
        }
      : {
          key: "7",
          icon: <UserOutlined />,
          label: <Link to="/login">Login</Link>,
        },
  ];

  return (
    <>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#001529",
          padding: "0 20px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          🛒 E-Commerce
        </div>

        {/* Desktop Menu */}
        {screens.md ? (
          <>
            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              items={menuItems.slice(0, 6)}
              style={{
                flex: 1,
                justifyContent: "center",
                borderBottom: "none",
                minWidth: 0,
              }}
            />

            <Menu
              theme="dark"
              mode="horizontal"
              selectable={false}
              items={[menuItems[6]]}
              style={{
                borderBottom: "none",
              }}
            />
          </>
        ) : (
          <Button
            type="text"
            icon={
              <MenuOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                }}
              />
            }
            onClick={() => setOpen(true)}
          />
        )}
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={() => setOpen(false)}
        />
      </Drawer>
    </>
  );
}

export default Navbar;