import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";

import addressService from "../services/addressService";

const { Title } = Typography;

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.log(error);
      message.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await addressService.updateAddress(
          editing.id,
          values
        );

        message.success("Address Updated");
      } else {
        await addressService.addAddress(values);

        message.success("Address Added");
      }

      setOpen(false);
      setEditing(null);
      form.resetFields();

      fetchAddresses();

    } catch (error) {
      console.log(error);

      message.error("Operation Failed");
    }
  };

  const handleEdit = (address) => {
    setEditing(address);

    form.setFieldsValue(address);

    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);

      message.success("Address Deleted");

      fetchAddresses();

    } catch (error) {
      console.log(error);

      message.error("Delete Failed");
    }
  };

  const handleAdd = () => {
    setEditing(null);

    form.resetFields();

    setOpen(true);
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
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <Title level={2}>My Addresses</Title>

        <Button
          type="primary"
          onClick={handleAdd}
        >
          Add Address
        </Button>
      </Space>

      <Modal
        open={open}
        title={
          editing
            ? "Edit Address"
            : "Add Address"
        }
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        okText={
          editing
            ? "Update"
            : "Save"
        }
      >
        <Form
          layout="vertical"
          form={form}
        >
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Enter Full Name",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Enter Phone Number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: "Enter Country",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                required: true,
                message: "Enter City",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Postal Code"
            name="postal_code"
            rules={[
              {
                required: true,
                message: "Enter Postal Code",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Enter Address",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>



            {addresses.length === 0 ? (
        <Empty description="No Address Found" />
      ) : (
        <Row gutter={[16, 16]}>
          {addresses.map((address) => (
            <Col xs={24} md={12} lg={8} key={address.id}>
              <Card
                title={address.full_name}
                extra={
                  <Space>
                    <Button
                      type="link"
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </Button>

                    <Popconfirm
                      title="Delete this address?"
                      onConfirm={() =>
                        handleDelete(address.id)
                      }
                    >
                      <Button danger type="link">
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <p>
                  <b>Phone:</b> {address.phone}
                </p>

                <p>
                  <b>Country:</b> {address.country}
                </p>

                <p>
                  <b>City:</b> {address.city}
                </p>

                <p>
                  <b>Postal Code:</b> {address.postal_code}
                </p>

                <p>
                  <b>Address:</b> {address.address}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Addresses;