import api from "./api";

const orderService = {
  // Checkout
  checkout: async (checkoutData) => {
    const response = await api.post(
      "/orders/",
      checkoutData
    );

    return response.data;
  },

  // Get Orders
  getOrders: async () => {
    const response = await api.get("/orders/");
    return response.data;
  },

  // Get Single Order
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;