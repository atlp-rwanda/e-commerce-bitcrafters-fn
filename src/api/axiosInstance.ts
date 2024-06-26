import axios from "axios";

const baseURL = "https://e-commerce-bitcrafters-bn-1mpf.onrender.com";
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
