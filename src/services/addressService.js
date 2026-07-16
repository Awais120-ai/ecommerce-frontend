import api from "./api";

const addressService = {
  // Get all addresses
  getAddresses: async () => {
    const response = await api.get("/addresses/");
    return response.data;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await api.post("/addresses/", addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  // Get single address
  getAddress: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },
  
  createAddress: async (data) => {
  const response = await api.post("/addresses/", data);
  return response.data;
}


};

export default addressService;