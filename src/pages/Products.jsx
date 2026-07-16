
import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  InputNumber,
  Button,
  Typography,
  Spin,
  Empty,
  Tag,
  Rate,
} from "antd";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { subscribeStockRefresh } from "../utils/stockRefresh";

const { Title } = Typography;
const { Option } = Select;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(undefined);
  const [minPrice, setMinPrice] = useState(undefined);
  const [maxPrice, setMaxPrice] = useState(undefined);
  const [sort, setSort] = useState("id");
  const navigate = useNavigate();

  // Load Products
  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await productService.getProducts({
  limit: 1000,
});
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load Categories
  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSearch("");
    setCategoryId(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSort("id");
  };

  // Load Categories Once
  useEffect(() => {
    loadCategories();
  }, []);

  // Auto Reload Products
  useEffect(() => {
    loadProducts();
  }, [
    search,
    categoryId,
    minPrice,
    maxPrice,
    sort,
  ]);

  useEffect(() => {
    const unsubscribe = subscribeStockRefresh(loadProducts);
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <Title level={2}>Products</Title>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        {/* Search */}
        <Col span={6}>
          <Input
            placeholder="Search Product"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </Col>

        {/* Category */}
        <Col span={4}>
          <Select
            style={{ width: "100%" }}
            placeholder="Category"
            value={categoryId}
            onChange={setCategoryId}
            allowClear
          >
            {categories.map((category) => (
              <Option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Min Price */}
        <Col span={3}>
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Min Price"
            value={minPrice}
            onChange={setMinPrice}
          />
        </Col>

        {/* Max Price */}
        <Col span={3}>
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Max Price"
            value={maxPrice}
            onChange={setMaxPrice}
          />
        </Col>

        {/* Sort */}
        <Col span={4}>
          <Select
            style={{ width: "100%" }}
            value={sort}
            onChange={setSort}
          >
            <Option value="id">
              Newest
            </Option>

            <Option value="name">
              Name
            </Option>

            <Option value="price">
              Price
            </Option>

            <Option value="stock">
              Stock
            </Option>
          </Select>
        </Col>

        {/* Clear Button */}
        <Col span={4}>
          <Button
            danger
            block
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
        </div>
      ) : products.length === 0 ? (
        <Empty description="No Products Found" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={product.id}
            >
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
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {product.description}
      </p>
    </div>

    <div style={{ marginTop: 0 }}>
      <Rate
        disabled
        defaultValue={4}
        style={{ fontSize: 16 }}
      />
    </div>

    <div style={{ marginTop: 4 }}>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "#0497b1",
        }}
      >
        Rs. {product.price}
      </span>
    </div>

    <div style={{ marginTop: 5 }}>
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

    <div style={{ marginTop: "auto" }}>
      <Button
        type="primary"
        size="large"
        block
        style={{
          marginTop: 18,
          borderRadius: 8,
          height: 45,
          fontWeight: 600,
        }}
        onClick={() =>
          navigate(`/products/${product.id}`)
        }
      >
        View Details
      </Button>
    </div>
  </div>
</Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Products;
