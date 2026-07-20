import api from "./api";

const cartService = {
  // Get all cart items
  getCart: async () => {
    const response = await api.get("/cart/");
    return response.data;
  },

  // Add product to cart
  addToCart: async (cartData) => {
    const response = await api.post(
      "/cart/",
      cartData
    );

    return response.data;
  },

  // Remove cart item
  removeFromCart: async (cartId) => {
    const response = await api.delete(
      `/cart/${cartId}`
    );

    return response.data;
  },

  // Update cart item quantity
  updateCart: async (cartId, quantity) => {
  const response = await api.put(
    `/cart/${cartId}`,
    {
      quantity,
    }
  );

  return response.data;
},

  // Buy Now (backend reserves the item without adding to cart)
  buyNow: async (buyNowData) => {
    const response = await api.post(
      "/cart/buy-now/",
      buyNowData
    );

    return response.data;
  },


};

export default cartService;