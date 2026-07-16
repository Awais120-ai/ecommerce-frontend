import { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Select,
  Table,
  Tag,
  message,
  Spin,
  Empty,
} from "antd";

import { useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";
import orderService from "../services/orderService";

const { Title } = Typography;
const { Option } = Select;

function Payment() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orderData = await orderService.getOrders();
      const paymentData = await paymentService.getPayments();

      
      const paidOrderIds = paymentData.map((p) => p.order_id);

const unpaidOrders = orderData.filter(
  (o) => !paidOrderIds.includes(o.id)
);

setOrders(unpaidOrders);

if (unpaidOrders.length > 0) {
  setSelectedOrder(unpaidOrders[0].id);
}


      setPayments(paymentData);

      if (orderData.length > 0) {
        setSelectedOrder(orderData[0].id);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

    const handlePayment = async () => {

    await paymentService.processPayment({
  order_id: selectedOrder,
  payment_method: paymentMethod,
});

message.success("Payment Successful");

fetchData();

setTimeout(() => {
  navigate("/orders");
}, 1000);


    if (!selectedOrder) {
      message.warning("Please select an order");
      return;
    }

    try {
      await paymentService.processPayment({
        order_id: selectedOrder,
        payment_method: paymentMethod,
      });

      message.success("Payment Successful");

      fetchData();
    } catch (error) {
      console.log(error);

      message.error(
        error.response?.data?.detail ||
          "Payment Failed"
      );
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "id",
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `Rs. ${amount}`,
    },
    {
      title: "Method",
      dataIndex: "payment_method",
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      
      render: (status) => {
  let color = "orange";

  if (status === "Completed") color = "green";
  if (status === "Failed") color = "red";
  if (status === "Pending") color = "gold";

  return <Tag color={color}>{status}</Tag>;
},

    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

    return (
    <div style={{ padding: 30 }}>
      <Title level={2}>Payment</Title>

      <Card style={{ marginBottom: 20 }}>
        {orders.length === 0 ? (
          <Empty description="No Orders Available !" />
        ) : (
          <>
            <Title level={5}>Select Order</Title>

            <Select
              style={{
                width: "100%",
                marginBottom: 20,
              }}
              value={selectedOrder}
              onChange={setSelectedOrder}
            >
              {orders.map((order) => (
                <Option
                  key={order.id}
                  value={order.id}
                >
                  Order #{order.id} - Rs. {order.total_price}
                </Option>
              ))}
            </Select>

            {selectedOrder && (
  <Card
    size="small"
    style={{ marginBottom: 20 }}
  >
    <p>
      <strong>Total Amount:</strong>{" "}
      Rs.{" "}
      {
        orders.find((o) => o.id === selectedOrder)
          ?.total_price
      }
    </p>
  </Card>
)}

            <Title level={5}>
              Payment Method
            </Title>

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

              <Option value="Credit Card">
                Credit Card
              </Option>

              <Option value="JazzCash">
                JazzCash
              </Option>

              <Option value="EasyPaisa">
                EasyPaisa
              </Option>
            </Select>

            <Button
              type="primary"
              size="large"
              block
              onClick={handlePayment}
            >
              Pay Now
            </Button>
          </>
        )}
      </Card>

      <Card>
        <Title level={4}>
          Payment History
        </Title>

        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  );
}

export default Payment;