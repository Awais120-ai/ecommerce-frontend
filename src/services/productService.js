import api from "./api";

export const getProducts = async (params = {}) => {
  const response = await api.get(
    "/products/",
    {
      params,
    }
  );

  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

const productService = {
  getProducts,
  getProduct,
};

export default productService;