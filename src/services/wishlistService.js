import api from "./api";

const wishlistService = {
  // Get Wishlist
  getWishlist: async () => {
    const response = await api.get("/wishlist/");
    return response.data;
  },

  // Add Product to Wishlist
  addToWishlist: async (wishlistData) => {
    const response = await api.post(
      "/wishlist/",
      wishlistData
    );

    return response.data;
  },

  // Remove Product from Wishlist
  removeFromWishlist: async (wishlistId) => {
    const response = await api.delete(
      `/wishlist/${wishlistId}`
    );

    return response.data;
  },
};

export default wishlistService;