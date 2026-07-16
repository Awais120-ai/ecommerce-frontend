import { useState } from "react";
import { Card, Button, Tag, Rate, message } from "antd";
import cartService from "../services/cartService";
import { emitStockRefresh } from "../utils/stockRefresh";

function ProductCard({ product }) {
  const [expanded, setExpanded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart({
        product_id: product.id,
        quantity: 1,
      });

      message.success("Product added to cart");
      emitStockRefresh();
    } catch (error) {
      console.log(error);

      message.error(
        error.response?.data?.detail ||
          "Failed to add product"
      );
    }
  };

  return (
    <Card
      hoverable
      style={{
        height: 580,
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      bodyStyle={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
      cover={
        <div
          style={{
            height: 260,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: 15,
          }}
        >
          <img
            src={
              product.image
                ? `http://127.0.0.1:8000/uploads/products/${product.image}`
                : "https://placehold.co/400x400?text=No+Image"
            }
            alt={product.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Product Name */}
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            minHeight: 40,
            lineHeight: "25px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>


        {/* Description */}
        <div
          style={{
            marginTop: 4,
            minHeight: 75,
          }}
        >
          <p
            style={{
              color: "#555",
              marginBottom: 2,
              lineHeight: "20px",
              display: "-webkit-box",
              WebkitLineClamp: expanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </p>

          {product.description &&
            product.description.length > 80 && (
              <Button
                type="link"
                size="small"
                style={{
                  padding: 0,
                  fontWeight: 600,
                }}
                onClick={() =>
                  setExpanded(!expanded)
                }
              >
                {expanded
                  ? "Show Less"
                  : "Show More"}
              </Button>
            )}
            </div>
                {/* Rating */}
                <div style={{ marginTop: 0 }}>
                  <Rate
                    disabled
                    defaultValue={4}
                    style={{ fontSize: 16 }}
                  />
                </div>

        {/* Price */}
        <div
          style={{
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: "semi-bold",
              color: "#0497b1",
            }}
          >
            Rs. {product.price}
          </span>
        </div>

        {/* Stock */}
        <div
          style={{
            marginTop: 5,
          }}
        >
          <Tag
            color={
              product.stock > 0
                ? "green"
                : "red"
            }
            style={{
              fontSize: 14,
            }}
          >
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </Tag>
        </div>

        {/* Button */}
        <div style={{ marginTop: "auto" }}>
          <Button
  type="primary"
  size="large"
  block
  disabled={product.stock <= 0}
  style={{
    marginTop: 18,
    borderRadius: 8,
    height: 45,
    fontWeight: 600,
  }}
  onClick={handleAddToCart}
>
  {product.stock > 0 ? "Add To Cart 🛒" : "Out of Stock"}
</Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;