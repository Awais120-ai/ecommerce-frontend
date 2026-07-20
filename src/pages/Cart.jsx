import { useEffect, useState } from "react";
import {
  Typography,
  Spin,
  Empty,
  Card,
  Row,
  Col,
  Button,
  Tag,
  message,
} from "antd";

import cartService from "../services/cartService";
import { useNavigate } from "react-router-dom";
import { emitStockRefresh } from "../utils/stockRefresh";

const { Title } = Typography;

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);

      const data = await cartService.getCart();
      console.log("Cart API Response:", data);
      setCartItems(data);
    } catch (error) {
      console.log(error);

      message.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    try {
      await cartService.removeFromCart(id);

      message.success("Item removed successfully");
      emitStockRefresh();
      fetchCart();
    } catch (error) {
      console.log(error);

      message.error("Failed to remove item");
    }
  };


  const updateQuantity = async (cartId, currentQuantity, change) => {
  if (change < 0) {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) return;

    try {
      await cartService.updateCart(cartId, newQuantity);

      emitStockRefresh();
      fetchCart();
    } catch (error) {
      console.log(error);

      message.error("Failed to update quantity");
    }
    return;
  }

  try {
    const latestCart = await cartService.getCart();

    const latestItem = latestCart.find((i) => i.id === cartId);

    if (!latestItem || !latestItem.product) return;

    const totalProductStock = latestItem.product.stock;

    const otherReserved = latestCart
      .filter(
        (i) =>
          i.id !== cartId &&
          i.product &&
          String(i.product.id) === String(latestItem.product.id)
      )
      .reduce((sum, i) => sum + i.quantity, 0);

    const maxQuantity = totalProductStock - otherReserved;

    if (currentQuantity >= maxQuantity) {
      message.info("Maximum available stock reached");
      return;
    }

    const newQuantity = currentQuantity + 1;

    await cartService.updateCart(cartId, newQuantity);

    emitStockRefresh();
    fetchCart();
  } catch (error) {
    console.log(error);

    message.error("Failed to update quantity");
  }
};


  const total = cartItems.reduce(
    (sum, item) => item.product ? sum + item.product.price * item.quantity : sum,
    0
  );

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

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "20px auto",
        padding: "15px",
      }}
    >
      <Title level={2} style={{ marginBottom: "20px" }}>🛒 My Cart</Title>

      {cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <>
          <Row gutter={[20, 20]}>
            {cartItems.map((item) => {
              if (!item.product) return null;

              const otherReserved = cartItems
                .filter(
                  (i) =>
                    i.id !== item.id &&
                    i.product &&
                    String(i.product.id) === String(item.product.id)
                )
                .reduce((sum, i) => sum + i.quantity, 0);

              const maxQuantity = item.product.stock - otherReserved;

              const atMaxStock = item.quantity >= maxQuantity;

              return (
              <Col span={24} key={item.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                  }}
                >
                  <Row align="middle" gutter={24}>
                    <Col xs={24} sm={8} md={5}>
                      <div
  style={{
    width: "100%",
    height: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #f0f0f0",
    borderRadius: 10,
    padding: 12,
  }}
>
  <img
    src={
      item.product.image
        ? `http://127.0.0.1:8000/uploads/products/${item.product.image}`
        : "https://placehold.co/400x400?text=No+Image"
    }
    alt={item.product.name}
    style={{
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    }}
  />
</div>
                    </Col>

                    <Col xs={24} sm={16} md={10}>
                      <Title level={4}>
                        {item.product.name}
                      </Title>

                      <p
                        style={{
                          color: "#666",
                        }}
                      >
                        {item.product.description}
                      </p>

                      <Tag color="green">
                        Rs. {item.product.price}
                      </Tag>


                      <div
  style={{
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
  }}
>
  <Button
    onClick={() =>
      updateQuantity(
        item.id,
        item.quantity,
        -1
      )
    }
  >
    -
  </Button>

  <Tag
    color="blue"
    style={{
      fontSize: 16,
      padding: "4px 15px",
    }}
  >
    {item.quantity}
  </Tag>

  <Button
    disabled={atMaxStock}
    onClick={() =>
      updateQuantity(
        item.id,
        item.quantity,
        1
      )
    }
  >
    +
  </Button>
</div>


                    </Col>

                    <Col
                      xs={24}
                      md={5}
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <>
  <Title level={4}>
    Rs. {item.product.price * item.quantity}
  </Title>

  <p
    style={{
      color: "#888",
    }}
  >
    Subtotal
  </p>
</>
                    </Col>

                    <Col
                      xs={24}
                      md={4}
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <Button
                        danger
                        onClick={() =>
                          handleRemove(item.id)
                        }
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
              );
            })}
          </Row>

          <Card
            style={{
              marginTop: 30,
              borderRadius: 12,
            }}
          >
            <Row
              justify="space-between"
              align="middle"
            >
              <Col>
                <Title level={3}>
                  Total: Rs. {total}
                </Title>
              </Col>

              <Col>
                <Button
                  size="large"
                  onClick={() =>
                    navigate("/products")
                  }
                >
                  Continue Shopping
                </Button>

                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginLeft: 15,
                  }}
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  Checkout
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
}

export default Cart;