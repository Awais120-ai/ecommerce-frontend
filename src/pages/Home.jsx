import { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";

import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

import { getProducts } from "../services/productService";
import { subscribeStockRefresh } from "../utils/stockRefresh";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    const unsubscribe = subscribeStockRefresh(fetchProducts);
    return () => unsubscribe();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts({ limit: 12 });
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />

      <h1 style={{ padding: "0 15px", marginBottom: "20px" }}>Latest Products</h1>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[20, 20]}>
          {products.map((product) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              key={product.id}
            >
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default Home;