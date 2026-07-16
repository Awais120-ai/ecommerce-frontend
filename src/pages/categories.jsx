import { useEffect, useState } from "react";
import { Card, Table, Typography, message } from "antd";
import categoryService from "../services/categoryService";

const { Title } = Typography;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await categoryService.getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Card>
      <Title level={3}>Categories</Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
      />
    </Card>
  );
};

export default Categories;