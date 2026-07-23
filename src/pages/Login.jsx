import { Card, Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useAuth } from "../context/AuthContext";

const { Title } = Typography;

function Login() {
    const navigate = useNavigate();
    const auth = useAuth();

    const onFinish = async (values) => {
      console.log(values);
  try {
    await auth.login(values);

    message.success("Login Successful");

    navigate("/");

  } catch (error) {

   message.error("Invalid email or password");

  }
};

  return (
    <div>
      <Button
        icon={<LeftOutlined />}
        type="default"
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        Back to Home
      </Button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f5f5f5",
        }}
      >
        <Card
          style={{
            width: 400,
            borderRadius: 10,
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
            }}
          >
            Login
          </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"


             rules={[
    {
      required: true,
      message: "Please enter email",
    },
  ]}

          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}

          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  </div>
  );
}

export default Login;