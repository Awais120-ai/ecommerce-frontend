import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Spin,
  Empty,
  message,
  Divider,
} from "antd";

import orderService from "../services/orderService";

const { Title, Text } = Typography;

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.log(error);
      message.error(
        error.response?.data?.detail ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 100,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 30 }}>
        <Empty description="Order Not Found" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Button
        onClick={() => navigate("/orders")}
        style={{ marginBottom: 20 }}
      >
        ← Back to Orders
      </Button>

      <Card>
        <Title level={2}>
          Order #{order.id}
        </Title>

        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Status:</Text>

            <br />

            <Tag
              color={
                order.status === "Completed"
                  ? "green"
                  : order.status === "Pending"
                  ? "orange"
                  : "red"
              }
            >
              {order.status}
            </Tag>
          </Col>

          <Col span={12}>
            <Text strong>Total Price:</Text>

            <Title
              level={3}
              style={{ color: "#1677ff" }}
            >
              Rs. {order.total_price}
            </Title>
          </Col>
        </Row>

        <Divider />

        <Title level={3}>
          Ordered Products
        </Title>

        {order.items?.length === 0 ? (
          <Empty description="No Products" />
        ) : (
          order.items.map((item) => (
            <Card
              key={item.id}
              style={{
                marginBottom: 20,
              }}
            >
              <Row
                gutter={20}
                align="middle"
              >
                <Col xs={24} md={6}>
                 <img
  src={
    item.product.image
      ? `http://127.0.0.1:8000/uploads/products/${item.product.image}`
      : "https://placehold.co/250x250?text=No+Image"
  }
  alt={item.product.name}
  style={{
    width: "100%",
    height: 200,
    objectFit: "contain",
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 10,
  }}
/>
                </Col>

                <Col xs={24} md={18}>
                  <Title level={4}>
                    {item.product.name}
                  </Title>

                  <Text type="secondary">
                    {item.product.description}
                  </Text>

                  <Divider />

                  <Row gutter={16}>
                    <Col span={8}>
                      <Text strong>
                        Quantity
                      </Text>

                      <br />

                      {item.quantity}
                    </Col>

                    <Col span={8}>
                      <Text strong>
                        Price
                      </Text>

                      <br />

                      Rs. {item.price}
                    </Col>

                    <Col span={8}>
                      <Text strong>
                        Total
                      </Text>

                      <br />

                      Rs.{" "}
                      {item.price *
                        item.quantity}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </Card>
    </div>
  );
}

export default OrderDetails;