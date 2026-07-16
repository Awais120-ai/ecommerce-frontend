import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Button,
  Space,
  message,
} from "antd";

import orderService from "../services/orderService";

const { Title, Text } = Typography;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.log(error);
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";

      case "Completed":
        return "green";

      case "Cancelled":
        return "red";

      default:
        return "blue";
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <Title level={2}>My Orders</Title>

      {orders.length === 0 ? (
        <Empty description="No Orders Found" />
      ) : (
        <Row gutter={[20, 20]}>
          {orders.map((order) => (
            <Col xs={24} md={12} lg={8} key={order.id}>
              <Card hoverable>
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                >
                  <Title level={4}>
                    Order #{order.id}
                  </Title>

                  <Text>
                    <strong>Status:</strong>{" "}
                    <Tag color={getStatusColor(order.status)}>
                      {order.status}
                    </Tag>
                  </Text>

                  <Text>
                    <strong>Total:</strong>
                  </Text>

                  <Title level={3} style={{ margin: 0 }}>
                    Rs. {order.total_price}
                  </Title>


                  <Button
  type="primary"
  block
  style={{ marginTop: 15 }}
  onClick={() => navigate(`/orders/${order.id}`)}
>
  View Details
</Button>

                  {order.created_at && (
                    <Text type="secondary">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </Text>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Orders;