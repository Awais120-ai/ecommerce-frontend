import {
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  Card,
  Row,
  Col,
  Spin,
  Tag,
  Typography,
  Button,
  Space,
  InputNumber,
  message,
} from "antd";

import productService from "../services/productService";
import cartService from "../services/cartService";
import wishlistService from "../services/wishlistService";
import { useNavigate } from "react-router-dom";
import { emitStockRefresh, subscribeStockRefresh } from "../utils/stockRefresh";

const { Title } = Typography;

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartItemExists, setCartItemExists] = useState(false);

  const loadProduct = async () => {
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartStatus = async () => {
    try {
      const cartData = await cartService.getCart();
      const found = cartData.find(
        (item) =>
          item.product &&
          String(item.product.id) === String(id)
      );

      setCartItemExists(Boolean(found));
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async () => {
    if (!product || product.stock <= 0 || addingToCart) return;

    try {
      setAddingToCart(true);

      await cartService.addToCart({
        product_id: product.id,
        quantity,
      });

      message.success("Product added to cart");
      setCartItemExists(true);
      await loadProduct();
      emitStockRefresh();
    } catch (error) {
      console.log(error);
      message.error("Unable to add product");
    } finally {
      setAddingToCart(false);
    }
  };

const addToWishlist = async () => {
  try {
    await wishlistService.addToWishlist({
      product_id: product.id,
    });

    message.success("Added to wishlist");
  } catch (error) {
    console.log(error);
    message.error("Unable to add wishlist");
  }
};

  const removeFromWishlist = async (id) => {
    try {
      await wishlistService.removeFromWishlist(id);

      message.success("Removed from wishlist");
    } catch (error) {
      console.log(error);
      message.error("Unable to remove wishlist");
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;

    if (inWishlist) {
      // remove
      try {
        await removeFromWishlist(wishlistItemId);
        setInWishlist(false);
        setWishlistItemId(null);
      } catch (error) {
        // errors handled in removeFromWishlist
      }
    } else {
      // add
      try {
        const data = await wishlistService.addToWishlist({ product_id: product.id });
        // try to capture created wishlist id if returned
        if (data && data.id) setWishlistItemId(data.id);
        setInWishlist(true);
        message.success("Added to wishlist");
      } catch (error) {
        console.log(error);
        message.error("Unable to add wishlist");
      }
    }
  };

const buyNow = async () => {
  if (!product) return;

  if (product.stock === 0) {
    if (!cartItemExists) return;
    navigate("/checkout");
    return;
  }

  try {
    const cartData = await cartService.getCart();
    const found = cartData.find(
      (item) =>
        item.product &&
        String(item.product.id) === String(id)
    );

    if (found) {
      navigate("/checkout");
      return;
    }
  } catch (error) {
    console.log(error);
  }

  navigate("/checkout", {
    state: {
      buyNow: true,
      product,
      quantity,
    },
  });
};
  useEffect(() => {

    const init = async () => {
      await loadProduct();

      // after product loads, check wishlist
      try {
        const list = await wishlistService.getWishlist();
        // wishlist items in this app are objects with `product` and `id` (see Wishlist.jsx)
        const found = list.find((item) => item.product && String(item.product.id) === String(id));

        if (found) {
          setInWishlist(true);
          setWishlistItemId(found.id);
        }
      } catch (err) {
        // ignore wishlist check errors
        console.log(err);
      }
    };

    init();
    loadCartStatus();

    const unsubscribe = subscribeStockRefresh(loadProduct);
    return () => unsubscribe();

  }, []);

  if (loading) {

    return <Spin size="large" />;

  }

  if (!product) {

    return <h2>Product Not Found</h2>;

  }

  return (
  <div
    style={{
      maxWidth: "1200px",
      margin: "40px auto",
      padding: "20px",
    }}
  >
    <Row gutter={[40, 40]} align="middle">
      <Col xs={24} md={10}>
        <div
  style={{
    width: "100%",
    height: 550,
    border: "1px solid #ddd",
    borderRadius: 12,
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
      </Col>

      <Col xs={24} md={14}>
        <Card
  bordered={false}
  style={{
    height: 550,
    display: "flex",
    flexDirection: "column",
  }}
  bodyStyle={{
    display: "flex",
    flexDirection: "column",
    height: "100%",
  }}
>
          <Title level={2}>
            {product.name}
          </Title>

          <div
            style={{
              marginBottom: 20,
            }}
          >
            <Tag
              color="green"
              style={{
                fontSize: 18,
                padding: "6px 14px",
              }}
            >
              Rs. {product.price}
            </Tag>

            <Tag
              color="blue"
              style={{
                fontSize: 16,
                padding: "6px 14px",
                marginLeft: 10,
              }}
            >
              Stock: {product.stock}
            </Tag>
          </div>

          <Title level={4}>
            Description
          </Title>

          <p
            style={{
              color: "#666",
              lineHeight: "28px",
              fontSize: 16,
            }}
          >
            {product.description}
          </p>


          <Space
  direction="vertical"
  size="large"
  style={{
    width: "100%",
    marginTop: 30,
  }}
>
  <div>
    <strong>Quantity</strong>

    <br />

    <InputNumber
      min={1}
      max={product.stock}
      value={quantity}
      onChange={setQuantity}
      style={{
        marginTop: 10,
      }}
    />
  </div>

  <Button
    type="primary"
    size="large"
    block
    disabled={product.stock <= 0 || addingToCart}
    loading={addingToCart}
    onClick={addToCart}
  >
    Add To Cart 🛒
  </Button>

  <Button block onClick={toggleWishlist}>
    {inWishlist ? "❌ Remove From Wishlist" : "❤️ Add To Wishlist"}
  </Button>

  <Button
    danger
    size="large"
    block
    disabled={product.stock === 0 && !cartItemExists}
    onClick={buyNow}
  >
    Buy Now
  </Button>
</Space>


        </Card>
      </Col>
    </Row>
  </div>
);

}

export default ProductDetails;