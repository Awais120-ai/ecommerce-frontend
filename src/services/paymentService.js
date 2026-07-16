import api from "./api";

const paymentService = {
  // Make Payment
  processPayment: async (paymentData) => {
    const response = await api.post(
      "/payments/",
      paymentData
    );

    return response.data;
  },

  // Payment History
  getPayments: async () => {
    const response = await api.get(
      "/payments/"
    );

    return response.data;
  },
};

export default paymentService;