import api from "./api";

export const authService = {
  login: async (data) => {
    const formData = new URLSearchParams();

    formData.append("username", data.email.trim());
    formData.append("password", data.password);
    
    console.log("Sending:", formData.toString());

    const response = await api.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data); 
    
    console.log("Response:", response.data);

    localStorage.setItem(
      "token",
      response.data.access_token
    );

    return response.data;
  },

  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authService;