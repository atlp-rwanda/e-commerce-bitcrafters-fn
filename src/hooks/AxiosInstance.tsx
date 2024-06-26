import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { PUBLIC_URL } from "../constants";


const useAxiosClient = (token?:string): AxiosInstance => {
const { authToken } = useSelector((state:any) => state.auth);
    
    const headers = token ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      } : {
        "Content-Type": "application/json",
      };

  const client = axios.create({
    baseURL: `${PUBLIC_URL}`,
    headers,
    timeout: 60000,
    withCredentials: false,
  });

  client.interceptors.request.use((config: any) => {

    const token = authToken
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      try {
        const { response } = error;
        if (response?.status === 401) {
          localStorage.removeItem("AUTH_TOKEN");
        }
      } catch (e) {
        console.error(e);
      }
      throw error;
    }
  );

  return client;
};

export default useAxiosClient;