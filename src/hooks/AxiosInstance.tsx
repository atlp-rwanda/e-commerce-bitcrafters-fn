import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { PUBLIC_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { setAuthRole, setAuthToken, setIsLoggedIn } from "../redux/authSlice";

const axiosInstance = axios.create({
  baseURL: `${PUBLIC_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const useAxiosClient = (token?: string): AxiosInstance => {
  const { authToken } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      
        dispatch(setIsLoggedIn(false));
        dispatch(setAuthToken(null));
        dispatch(setAuthRole(null));
        navigate("/login");
      
    } catch (error) {
      console.log("logout failed");
    }
  };

  const headers = token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };

  const client = axios.create({
    baseURL: `${PUBLIC_URL}`,
    headers,
    timeout: 60000,
    withCredentials: false,
  });

  client.interceptors.request.use((config: any) => {
    const token = authToken;
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
        const { response  }  = error as unknown as any;
        if (response?.data.error === "jwt expired" || response?.data.error === "Please Login" || response?.data.message=== "Please login again")  {
          handleLogout()
        }
      } catch (e) {
        console.error("error occured here", e);
      }
      throw error;
    },
  );

  return client;
};

export default useAxiosClient;
export { axiosInstance };
