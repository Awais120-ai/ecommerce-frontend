import { Layout } from "antd";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const { Content } = Layout;

function MainLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content
        style={{
          padding: "20px 50px",
          background: "#f5f5f5",
        }}
      >
        {children}
      </Content>

      <Footer />
    </Layout>
  );
}

export default MainLayout;