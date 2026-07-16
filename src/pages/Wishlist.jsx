import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Empty,
  Spin,
  message,
  Popconfirm,
} from "antd";

import wishlistService from "../services/wishlistService";

const { Title } = Typography;

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.log(error);
      message.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (id) => {
    try {
      await wishlistService.removeFromWishlist(id);

      message.success("Removed from wishlist");

      fetchWishlist();
    } catch (error) {
      console.log(error);
      message.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <Title level={2}>My Wishlist</Title>

      {wishlist.length === 0 ? (
        <Empty description="Wishlist is Empty" />
      ) : (
        <Row gutter={[16, 16]}>
          {wishlist.map((item) => (
            <Col xs={24} md={12} lg={8} key={item.id}>
              <Card
                hoverable
                cover={
  <div
    style={{
      height: 260,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      borderBottom: "1px solid #f0f0f0",
      padding: 5,
    }}
  >
    <img
      alt={item.product.name}
      src={
        item.product.image
          ? `http://127.0.0.1:8000/uploads/products/${item.product.image}`
          : "https://placehold.co/400x400?text=No+Image"
      }
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
      }}
    />
  </div>
}
              >
                <Title level={4}>
                  {item.product.name}
                </Title>

                <p>{item.product.description}</p>

                <Title level={5}>
                  Rs. {item.product.price}
                </Title>

                <Popconfirm
                  title="Remove this item?"
                  onConfirm={() => removeItem(item.id)}
                >
                  <Button danger block>
                    Remove
                  </Button>
                </Popconfirm>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Wishlist;