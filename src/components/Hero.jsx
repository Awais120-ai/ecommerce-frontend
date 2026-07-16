import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

function Hero() {
  return (
    <div
      style={{
        background: "#1677ff",
        color: "white",
        padding: "80px",
        borderRadius: "12px",
        textAlign: "center",
        marginBottom: "40px",
      }}
    >
      <Title style={{ color: "white" }}>
        Welcome to Our E-Commerce Store
      </Title>

      <Paragraph
        style={{
          color: "white",
          fontSize: 18,
        }}
      >
        Discover the latest products at the best prices.
      </Paragraph>

      
    </div>
  );
}

export default Hero;