import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tag,
  message,
  Select,
  Form,
  Modal,
  Input,
} from "antd";

import cartService from "../services/cartService";
import orderService from "../services/orderService";
import addressService from "../services/addressService";
import paymentService from "../services/paymentService";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

const buyNow = location.state?.buyNow || false;
const buyNowProduct = location.state?.product;
const buyNowQuantity = location.state?.quantity;
  const { Title } = Typography;
  const { Option } = Select;
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash On Delivery");

  const [openAddressModal, setOpenAddressModal] = useState(false);

  const [addressForm] = Form.useForm();




useEffect(() => {
  let isMounted = true;

  const loadCheckoutData = async () => {
    try {
      const addressData = await addressService.getAddresses();

      if (!isMounted) return;

      if (!buyNow) {
        const cartData = await cartService.getCart();
        setCartItems(cartData);
      }

      setAddresses(addressData);

      if (addressData.length > 0) {
        setSelectedAddress(addressData[0].id);
      }

    } catch (error) {
      console.error(error);
      message.error("Failed to load checkout data");
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadCheckoutData();

  return () => {
    isMounted = false;
  };
}, []);

  const total = buyNow
  ? buyNowProduct.price * buyNowQuantity
  : cartItems.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );


  const handleSaveAddress = async () => {
    try {
      const values = await addressForm.validateFields();

      await addressService.addAddress(values);

      message.success("Address Added");

      setOpenAddressModal(false);
      addressForm.resetFields();

      const data = await addressService.getAddresses();
      setAddresses(data);

      if (data.length > 0) {
        setSelectedAddress(data[data.length - 1].id);
      }
    } catch (error) {
      console.log(error);
      message.error("Unable to save address");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
    message.warning("Please select an address");
    return;
  }

  try {
    // Step 1: Create Order
    const order = await orderService.checkout({
  address_id: selectedAddress,
  payment_method: paymentMethod,

  buy_now: buyNow,
  product_id: buyNow ? buyNowProduct.id : null,
  quantity: buyNow ? buyNowQuantity : null,
});

    // Step 2: Create Payment
    await paymentService.processPayment({
      order_id: order.id,
      payment_method: paymentMethod,
    });

    message.success("Order Placed Successfully");

    navigate("/orders");

  } catch (error) {
    console.log(error);

    message.error(
      error.response?.data?.detail || "Checkout Failed"
    );
  }
};



  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <Title level={2}>Checkout</Title>

      {!buyNow && cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <Row gutter={24}>
          {/* Cart Items */}
          <Col xs={24} md={16}>
            {(
  buyNow
    ? [
        {
          product: buyNowProduct,
          quantity: buyNowQuantity,
        },
      ]
    : cartItems
).map((item) => (
              <Card
                key={item.id}
                style={{ marginBottom: 20 }}
              >
                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <img
                      src={
                        item.product.image
                          ? `http://127.0.0.1:8000/uploads/products/${item.product.image}`
                          : "https://placehold.co/120x120?text=No+Image"
                      }
                      alt={item.product.name}
                      width={120}
                      style={{ borderRadius: 8 }}
                    />
                  </Col>

                  <Col span={18}>
                    <Title level={5}>
                      {item.product.name}
                    </Title>

                    <p>{item.product.description}</p>

                    <Tag color="green">
                      Rs. {item.product.price}
                    </Tag>

                    <Tag color="blue">
                      Qty: {item.quantity}
                    </Tag>
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>

          {/* Summary */}
          <Col xs={24} md={8}>
            <Card title="Order Summary">
              <p>
                <strong>Total Items:</strong> {buyNow ? 1 : cartItems.length}
              </p>

              <p>
                <strong>Total Price:</strong> Rs. {total}
              </p>

              <hr />

<p>
  <strong>Select Address</strong>
</p>

<Button
  type="link"
  style={{
    padding: 0,
    marginBottom: 20,
  }}
  onClick={() => setOpenAddressModal(true)}
>
  + Add New Address
</Button>

<Select
  style={{
    width: "100%",
    marginBottom: 20,
  }}
  value={selectedAddress}
  onChange={setSelectedAddress}
>
  {addresses.map((address) => (
    <Option key={address.id} value={address.id}>
      {address.full_name} - {address.city}
    </Option>
  ))}
</Select>

<p>
  <strong>Payment Method</strong>
</p>

<Select
  style={{
    width: "100%",
    marginBottom: 20,
  }}
  value={paymentMethod}
  onChange={setPaymentMethod}
>

  <Option value="Cash On Delivery">
    Cash On Delivery
  </Option>

  <Option value="JazzCash">
    JazzCash
  </Option>

  <Option value="EasyPaisa">
    EasyPaisa
  </Option>

  <Option value="Credit Card">
    Credit Card
  </Option>

</Select>


              <Button
                type="primary"
                size="large"
                block
                onClick={handleCheckout}
              >
                Place Order
              </Button>


              <Modal
  open={openAddressModal}
  title="Add Address"
  okText="Save"
  onCancel={() => {
    setOpenAddressModal(false);
    addressForm.resetFields();
  }}
  onOk={handleSaveAddress}
>
  <Form
    layout="vertical"
    form={addressForm}
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
          message: "Enter Phone",
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



            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Checkout;