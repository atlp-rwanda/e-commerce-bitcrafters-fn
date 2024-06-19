import {axiosInstance} from "../hooks/AxiosInstance";

interface AuthResponse {
  message: string;
  user: any;
}

export const signup = async (
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/users/signup", {
    username,
    email,
    password,
  });
  return response.data;
};
